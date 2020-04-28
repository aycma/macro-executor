/*---------------------------------------------------------------------------------------------
 *	Copyright (c) 2020 Simon Waelti
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import * as nodes from '../parser/macroNodes';
import * as nls from 'vscode-nls';

import { TextDocument, MacroFileProvider } from '../MacroLanguageTypes';
import { Rules, Rule } from './lintRules';
const localize = nls.loadMessageBundle();

const _0 = '0'.charCodeAt(0);
const _9 = '9'.charCodeAt(0);
const _dot = '.'.charCodeAt(0);

export class LintVisitor implements nodes.IVisitor {

	static entries(macrofile: nodes.Node, document: TextDocument, fileProvider?: MacroFileProvider): nodes.IMarker[] {
		const visitor = new LintVisitor(macrofile, fileProvider);
		visitor.LoadIncludes(macrofile);
		macrofile.acceptVisitor(visitor);
		return visitor.getEntries();
	}

	private declarations:Map<string,nodes.AbstractDeclaration> = new Map<string,nodes.AbstractDeclaration>()
	
	private rules: nodes.IMarker[] = [];
	private imports:string[] = [];

	private constructor(private macrofile: nodes.Node, private fileProvider?: MacroFileProvider) { }

	public getEntries(filter: number = (nodes.Level.Warning | nodes.Level.Error)): nodes.IMarker[] {
		return this.rules.filter(entry => {
			return (entry.getLevel() & filter) !== 0;
		});
	}

	public addEntry(node: nodes.Node, rule: Rule, details?: string): void {
		const entry = new nodes.Marker(node, rule, rule.defaultValue, details);
		this.rules.push(entry);
	}

	public visitNode(node: nodes.Node): boolean {
		switch (node.type) {
			case nodes.NodeType.MacroFile:
				return this.visitGlobalScope(<nodes.MacroFile>node);
			case nodes.NodeType.Symbol:
				return this.visitSymbols(<nodes.Symbol>node);
			case nodes.NodeType.Variable:
				return this.visitVariables(<nodes.Variable>node);
			case nodes.NodeType.label:
				return this.visitLabels(<nodes.Label>node);
			case nodes.NodeType.VariableDef:
				return this.visitDeclarations(<nodes.VariableDeclaration>node);
			case nodes.NodeType.labelDef:
				return this.visitDeclarations(<nodes.LabelDeclaration>node);
			case nodes.NodeType.Function:
				return this.visitFunction(<nodes.Function>node);
			case nodes.NodeType.Statement:
				return this.visitStatement(<nodes.NcStatement>node);
			case nodes.NodeType.SequenceNumber:
				return this.visitSequenceNumber(<nodes.SequenceNumber>node);		
		}
		return true;
	}

	private LoadIncludes(node:nodes.MacroFile) {

		let promises:Promise<any>[] = [];
		node.accept(candidate => {
			if (candidate.type === nodes.NodeType.Include) {
				this.visitInclude(<nodes.Include>candidate);
				return false;
			}
			return true;
		});
	}

	private visitGlobalScope(node: nodes.Node) : boolean {
		for (const element of node.getChildren()) {
			if (element.type === nodes.NodeType.Symbol){
				this.addEntry(element, Rules.IllegalStatement);
			}
		}
		return true;
	}

	private visitInclude(node: nodes.Include) {
		let uri = node.getChild(0);
		if (!uri) {return;}

		if (this.imports.indexOf(uri?.getText()) > -1){
			this.addEntry(node, Rules.DuplicateDeclarations);
		}
		else{
			this.imports.push(uri.getText());
			let declaration = this.fileProvider?.get(uri.getText());
			
			if (declaration) {
				(<nodes.Node>declaration?.macrofile).accept(candidate => {
					let found = false;
					if (candidate.type === nodes.NodeType.VariableDef || candidate.type === nodes.NodeType.labelDef) {
						this.visitDeclarations(candidate);
						found = true;
					}
					return !found;
				});
			}
			else {
				this.addEntry(node, Rules.IncludeNotFound);
				return;
			}
		}
	}

	private visitFunction(node: nodes.Function): boolean {
		return true;
	}	

	private visitSymbols(node: nodes.Symbol) : boolean {

		// Check references
		if (!this.declarations.has(node.getText())) {
			if (!this.isNumeric(node.getText())) {
				this.addEntry(node, Rules.UnknownSymbol);
			}
		}
		return true;
	}

	private visitVariables(node: nodes.Variable) : boolean {
		return true;
	}

	private visitLabels(node: nodes.Label) : boolean {
		return true;
	}

	private visitDeclarations(node: nodes.Node) : boolean{
		// scan local declarations
		let def = <nodes.AbstractDeclaration>node;
		let ident = def.getName();

		if (ident){
			if (this.declarations.has(ident)){
				this.addEntry(def, Rules.DuplicateDeclarations);
			}
			
			for (const element of this.declarations.values()){
				if (element.getValue()?.getText() === def.getValue()?.getText()){
					//this.addEntry(def, Rules.DuplicateAddress);
				}
			}
			
			if (node.type === nodes.NodeType.VariableDef) {
				this.declarations.set(ident, <nodes.VariableDeclaration>node);
			}
			else if (node.type === nodes.NodeType.labelDef) {
				this.declarations.set(ident, <nodes.LabelDeclaration>node);
			}
		}
		return true;
	}

	private visitStatement(node: nodes.NcStatement): boolean {
		return true;
	}

	private sequenceNumbers:SequenceNumberMap = new SequenceNumberMap();
	private visitSequenceNumber(node: nodes.SequenceNumber): boolean {

		let sequence = node.getText();
		if (sequence) {
			let func = <nodes.Function>node.findAParent(nodes.NodeType.Function);
			let a = this.sequenceNumbers.get(func);
			let index = a?.indexOf(sequence);
			if (index !== undefined && index > -1){
				this.addEntry(node, Rules.DuplicateSequence);
			} 
			else {
				this.sequenceNumbers.add(func, sequence);
			}
		}
		return true;
	}

	private isNumeric(text:string) : boolean {
		let isNumber = (ch:number) => {
			return ch >= _0 && ch <= _9 || ch ===_dot;
		};
		let len = 0;
		for (; len < text.length; len++) {
			let c = text.charCodeAt(len);
			if (!isNumber(text.charCodeAt(len))){
				return false;
			}
		}
		return true; 
	}
}

class SequenceNumberMap {
	private numbers:Map<nodes.Function, string[]> = new Map<nodes.Function,string[]>();
	public add(key:nodes.Function, value:string){
		if (!this.numbers.has(key)){
			this.numbers.set(key, new Array<string>());
		}
		this.numbers.get(key)?.push(value);
	}

	public get(key:nodes.Function) : string[] | undefined {
		return this.numbers.get(key);
	}
}