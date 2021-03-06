/*---------------------------------------------------------------------------------------------
 *  Copyright (c) 2020 Simon Waelti
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import * as nodes from './macroNodes';

import * as nls from 'vscode-nls';

const localize: nls.LocalizeFunc = nls.loadMessageBundle();

export class MacroIssueType implements nodes.IRule {
	id: string;
	message: string;

	public constructor(id: string, message: string) {
		this.id = id;
		this.message = message;
	}
}

export const ParseError = {

	DefinitionExpected: new MacroIssueType('macro-definitionexpected', localize('expected.definition', 'definition file expected')),
	UnknownKeyword: new MacroIssueType('macro-unknownkeyword', localize('unknown.keyword', 'unknown keyword')),
	EndifExpected: new MacroIssueType('macro-endifexpected', localize('expected.endif', 'endif expected')),
	EndExpected: new MacroIssueType('macro-endexpected', localize('expected.end', 'end expected')),
	DoExpected: new MacroIssueType('macro-doexpected', localize('expected.do', 'do expected')),
	ThenGotoExpected: new MacroIssueType('macro-thengotoexpected', localize('expected.thenGoto', 'Then or goto expected')),
	NewLineExpected: new MacroIssueType('macro-newlineexpected', localize('expected.newline', 'newline expected')),
	LeftSquareBracketExpected: new MacroIssueType('macro-lbracketexpected', localize('expected.lsquare', '[ expected')),
	RightSquareBracketExpected: new MacroIssueType('macro-rbracketexpected', localize('expected.rsquare', '] expected')),
	Badstring: new MacroIssueType('macro-badstring', localize('expected.badstring', 'Missing string delimiter')),
	OperatorExpected: new MacroIssueType('macro-operatorexpected', localize('expected.operator', 'operator expected')),
	IdentifierExpected: new MacroIssueType('macro-identifierexpected', localize('expected.ident', 'identifier expected')),
	FunctionIdentExpected: new MacroIssueType('macro-functionidentifierexpected', localize('expected.funcident', 'function identifier expected')),
	AddressExpected: new MacroIssueType('macro-addressexpected', localize('expected.address', 'address expected')),
	MacroVariableExpected: new MacroIssueType('macro-macrovariableexpected', localize('expected.macrovariable', 'value variable (#) expected')),
	BodyExpected: new MacroIssueType('macro-bodyexpected', localize('expected.body', 'body expected')),
	LabelExpected: new MacroIssueType('macro-labelexpected', localize('expected.label', 'label expected')),
	TermExpected: new MacroIssueType('macro-termexpected', localize('expected.term', 'term expected')),
	NumberExpected: new MacroIssueType('macro-numberexpected', localize('expected.number', 'number expected')),
	IntegerExpected: new MacroIssueType('macro-integerexpected', localize('expected.integer', 'integer expected')),
	ParameterExpected: new MacroIssueType('macro-numberexpected', localize('expected.parameter', 'parameter expected')),
	InvalidStatement: new MacroIssueType('macro-invalidstatement', localize('expected.invalidstatement', 'Invalid statement')),
	ExpressionExpected: new MacroIssueType('macro-expressionexpected', localize('expected.expression', 'expression expected')),
	UnexpectedToken: new MacroIssueType('macro-unexpectedToken', localize('expected.unexpectedToken', 'unexpected token')),
	EqualExpected: new MacroIssueType('macro-equalExpected', localize('expected.equalExpected', ' = expected')),
};
