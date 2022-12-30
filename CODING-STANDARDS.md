# Coding Standards

We use the [Syle Guide](https://docs.soliditylang.org/en/latest/style-guide.html) from soliditylang.org as our coding standards.
For typescript we use https://success.vanillaforums.com/kb/articles/226-coding-standard-typescript#4.-namespaces-types-and-interfaces

Below is a direct copy/paste from their docs
- [Coding Standards](#coding-standards)
- [Solidity](#solidity)
  - [Code Layout](#code-layout)
    - [Source File Encoding](#source-file-encoding)
    - [Imports](#imports)
    - [Order of Functions](#order-of-functions)
    - [Whitespace in Expressions](#whitespace-in-expressions)
  - [Control Structures](#control-structures)
  - [Function Declaration](#function-declaration)
  - [Mappings](#mappings)
  - [Variable Declarations](#variable-declarations)
  - [Other Recommendations](#other-recommendations)
  - [Order of Layout](#order-of-layout)
  - [Naming Conventions](#naming-conventions)
    - [Naming Styles](#naming-styles)
    - [Names to Avoid](#names-to-avoid)
    - [Contract and Library Names](#contract-and-library-names)
    - [Struct Names](#struct-names)
    - [Event Names](#event-names)
    - [Function Names](#function-names)
    - [Function Argument Names](#function-argument-names)
    - [Local and State Variable Names](#local-and-state-variable-names)
    - [Constants](#constants)
    - [Modifier Names](#modifier-names)
    - [Enums](#enums)
    - [Avoiding Naming Collisions](#avoiding-naming-collisions)
- [Typescript](#typescript)
  - [Overview](#overview)
    - [Styling rules](#styling-rules)
  - [General](#general)
    - [Files](#files)
    - [Indenting](#indenting)
    - [Single and double quotes](#single-and-double-quotes)
    - [Forbidden types](#forbidden-types)
  - [Class constants, properties, and methods](#class-constants-properties-and-methods)
    - [Static class properties](#static-class-properties)
    - [Extends and Implements](#extends-and-implements)
    - [Properties](#properties)
    - [Methods](#methods)
    - [Methods with a bound this context](#methods-with-a-bound-this-context)
    - [abstract and static](#abstract-and-static)
  - [Variables, objects \& functions](#variables-objects--functions)
    - [Variable declarations](#variable-declarations-1)
    - [Objects](#objects)
    - [Declaring functions](#declaring-functions)
    - [Calling Functions](#calling-functions)
  - [Control structures](#control-structures-1)
    - [if, else if, else](#if-else-if-else)
    - [switch, case](#switch-case)
    - [for of, forEach, and for in](#for-of-foreach-and-for-in)
  - [Doc blocks](#doc-blocks)

# Solidity

## Code Layout


**Indentation**

Use 4 spaces per indentation level.

**Tabs or Spaces**

Spaces are the preferred indentation method.
Mixing tabs and spaces should be avoided.

**Blank Lines**

Within a contract surround function declarations with a single blank line.
Blank lines may be omitted between groups of related one-liners (such as stub functions for an abstract contract)

Yes:

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.9.0;

abstract contract A {
    function spam() public virtual pure;
    function ham() public virtual pure;
}


contract B is A {
    function spam() public pure override {
        // ...
    }

    function ham() public pure override {
        // ...
    }
}
```

No:

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.9.0;

abstract contract A {
    function spam() virtual pure public;
    function ham() public virtual pure;
}


contract B is A {
    function spam() public pure override {
        // ...
    }
    function ham() public pure override {
        // ...
    }
}
```

**Maximum Line Length**

Maximum suggested line length is 120 characters.

**Function Calls**

Yes:

```solidity
    thisFunctionCallIsReallyLong(
        longArgument1,
        longArgument2,
        longArgument3
    );
```

No:

```solidity
    thisFunctionCallIsReallyLong(longArgument1,
                                  longArgument2,
                                  longArgument3
    );

    thisFunctionCallIsReallyLong(longArgument1,
        longArgument2,
        longArgument3
    );

    thisFunctionCallIsReallyLong(
        longArgument1, longArgument2,
        longArgument3
    );

    thisFunctionCallIsReallyLong(
    longArgument1,
    longArgument2,
    longArgument3
    );

    thisFunctionCallIsReallyLong(
        longArgument1,
        longArgument2,
        longArgument3);
```

**Assignment Statements**

Yes:

```solidity
    thisIsALongNestedMapping[being][set][toSomeValue] = someFunction(
        argument1,
        argument2,
        argument3,
        argument4
    );
```

No:

```solidity
    thisIsALongNestedMapping[being][set][toSomeValue] = someFunction(argument1,
                                                                       argument2,
                                                                       argument3,
                                                                       argument4);
```

**Event Definitions and Event Emitters**

Yes:

```solidity
    event LongAndLotsOfArgs(
        address sender,
        address recipient,
        uint256 publicKey,
        uint256 amount,
        bytes32[] options
    );

    LongAndLotsOfArgs(
        sender,
        recipient,
        publicKey,
        amount,
        options
    );
```

No:

```solidity
    event LongAndLotsOfArgs(address sender,
                            address recipient,
                            uint256 publicKey,
                            uint256 amount,
                            bytes32[] options);

    LongAndLotsOfArgs(sender,
                      recipient,
                      publicKey,
                      amount,
                      options);
```

### Source File Encoding
---

UTF-8 or ASCII encoding is preferred.

### Imports
---

Import statements should always be placed at the top of the file.

Yes:

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.0 <0.9.0;

import "./Owned.sol";

contract A {
    // ...
}


contract B is Owned {
    // ...
}
```

No:

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.0 <0.9.0;

contract A {
    // ...
}


import "./Owned.sol";


contract B is Owned {
    // ...
}
```

### Order of Functions
---

Ordering helps readers identify which functions they can call and to find the constructor and fallback definitions easier.

Functions should be grouped according to their visibility and ordered:

- constructor
- receive function (if exists)
- fallback function (if exists)
- external
- public
- internal
- private

Within a grouping, place the `view` and `pure` functions last.

Yes:

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
contract A {
    constructor() {
        // ...
    }

    receive() external payable {
        // ...
    }

    fallback() external {
        // ...
    }

    // External functions
    // ...

    // External functions that are view
    // ...

    // External functions that are pure
    // ...

    // Public functions
    // ...

    // Internal functions
    // ...

    // Private functions
    // ...
}
```

No:

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
contract A {

    // External functions
    // ...

    fallback() external {
        // ...
    }
    receive() external payable {
        // ...
    }

    // Private functions
    // ...

    // Public functions
    // ...

    constructor() {
        // ...
    }

    // Internal functions
    // ...
}
```

### Whitespace in Expressions
---

Avoid extraneous whitespace in the following situations:

Immediately inside parenthesis, brackets or braces, with the exception of single line function declarations.

Yes:

```solidity
    spam(ham[1], Coin({name: "ham"}));
```

No:

```solidity
    spam( ham[ 1 ], Coin( { name: "ham" } ) );
```

Exception:

```solidity
    function singleLine() public { spam(); }
```

Immediately before a comma, semicolon:

Yes:

```solidity
    function spam(uint i, Coin coin) public;
```

No:

```solidity
    function spam(uint i , Coin coin) public ;
```

More than one space around an assignment or other operator to align with another:

Yes:

```solidity
    x = 1;
    y = 2;
    longVariable = 3;
```

No:

```solidity
    x            = 1;
    y            = 2;
    longVariable = 3;
```

Don't include a whitespace in the receive and fallback functions:

Yes:

```solidity
    receive() external payable {
        ...
    }

    fallback() external {
        ...
    }
```

No:

```solidity
    receive () external payable {
        ...
    }

    fallback () external {
        ...
    }
```

## Control Structures

The braces denoting the body of a contract, library, functions and structs
should:

* open on the same line as the declaration
* close on their own line at the same indentation level as the beginning of the
  declaration.
* The opening brace should be preceded by a single space.

Yes:

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.0 <0.9.0;

contract Coin {
    struct Bank {
        address owner;
        uint balance;
    }
}
```

No:

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.0 <0.9.0;

contract Coin
{
    struct Bank {
        address owner;
        uint balance;
    }
}
```

The same recommendations apply to the control structures `if`, `else`, `while`,
and `for`.

Additionally there should be a single space between the control structures
`if`, `while`, and `for` and the parenthetic block representing the
conditional, as well as a single space between the conditional parenthetic
block and the opening brace.

Yes:

```solidity
    if (...) {
        ...
    }

    for (...) {
        ...
    }
```

No:

```solidity
    if (...)
    {
        ...
    }

    while(...){
    }

    for (...) {
        ...;}
```

For control structures whose body contains a single statement, omitting the
braces is ok *if* the statement is contained on a single line.

Yes:

```solidity
    if (x < 10)
        x += 1;
```

No:

```solidity
    if (x < 10)
        someArray.push(Coin({
            name: 'spam',
            value: 42
        }));
```

For `if` blocks which have an `else` or `else if` clause, the `else` should be
placed on the same line as the `if`'s closing brace. This is an exception compared
to the rules of other block-like structures.

Yes:

```solidity
    if (x < 3) {
        x += 1;
    } else if (x > 7) {
        x -= 1;
    } else {
        x = 5;
    }


    if (x < 3)
        x += 1;
    else
        x -= 1;
```

No:

```solidity
    if (x < 3) {
        x += 1;
    }
    else {
        x -= 1;
    }
```

## Function Declaration

For short function declarations, it is recommended for the opening brace of the
function body to be kept on the same line as the function declaration.

The closing brace should be at the same indentation level as the function
declaration.

The opening brace should be preceded by a single space.

Yes:

```solidity
    function increment(uint x) public pure returns (uint) {
        return x + 1;
    }

    function increment(uint x) public pure onlyOwner returns (uint) {
        return x + 1;
    }
```

No:

```solidity
    function increment(uint x) public pure returns (uint)
    {
        return x + 1;
    }

    function increment(uint x) public pure returns (uint){
        return x + 1;
    }

    function increment(uint x) public pure returns (uint) {
        return x + 1;
        }

    function increment(uint x) public pure returns (uint) {
        return x + 1;}
```

The modifier order for a function should be:

1. Visibility
2. Mutability
3. Virtual
4. Override
5. Custom modifiers

Yes:

```solidity
    function balance(uint from) public view override returns (uint)  {
        return balanceOf[from];
    }

    function shutdown() public onlyOwner {
        selfdestruct(owner);
    }
```

No:

```solidity
    function balance(uint from) public override view returns (uint)  {
        return balanceOf[from];
    }

    function shutdown() onlyOwner public {
        selfdestruct(owner);
    }
```

For long function declarations, it is recommended to drop each argument onto
its own line at the same indentation level as the function body.  The closing
parenthesis and opening bracket should be placed on their own line as well at
the same indentation level as the function declaration.

Yes:

```solidity
    function thisFunctionHasLotsOfArguments(
        address a,
        address b,
        address c,
        address d,
        address e,
        address f
    )
        public
    {
        doSomething();
    }
```

No:

```solidity
    function thisFunctionHasLotsOfArguments(address a, address b, address c,
        address d, address e, address f) public {
        doSomething();
    }

    function thisFunctionHasLotsOfArguments(address a,
                                            address b,
                                            address c,
                                            address d,
                                            address e,
                                            address f) public {
        doSomething();
    }

    function thisFunctionHasLotsOfArguments(
        address a,
        address b,
        address c,
        address d,
        address e,
        address f) public {
        doSomething();
    }
```

If a long function declaration has modifiers, then each modifier should be
dropped to its own line.

Yes:

```solidity
    function thisFunctionNameIsReallyLong(address x, address y, address z)
        public
        onlyOwner
        priced
        returns (address)
    {
        doSomething();
    }

    function thisFunctionNameIsReallyLong(
        address x,
        address y,
        address z
    )
        public
        onlyOwner
        priced
        returns (address)
    {
        doSomething();
    }
```

No:

```solidity
    function thisFunctionNameIsReallyLong(address x, address y, address z)
                                          public
                                          onlyOwner
                                          priced
                                          returns (address) {
        doSomething();
    }

    function thisFunctionNameIsReallyLong(address x, address y, address z)
        public onlyOwner priced returns (address)
    {
        doSomething();
    }

    function thisFunctionNameIsReallyLong(address x, address y, address z)
        public
        onlyOwner
        priced
        returns (address) {
        doSomething();
    }
```

Yes:

```solidity
    function thisFunctionNameIsReallyLong(
        address a,
        address b,
        address c
    )
        public
        returns (
            address someAddressName,
            uint256 LongArgument,
            uint256 Argument
        )
    {
        doSomething()

        return (
            veryLongReturnArg1,
            veryLongReturnArg2,
            veryLongReturnArg3
        );
    }
```

No:

```solidity
    function thisFunctionNameIsReallyLong(
        address a,
        address b,
        address c
    )
        public
        returns (address someAddressName,
                 uint256 LongArgument,
                 uint256 Argument)
    {
        doSomething()

        return (veryLongReturnArg1,
                veryLongReturnArg1,
                veryLongReturnArg1);
    }
```

For constructor functions on inherited contracts whose bases require arguments,
it is recommended to drop the base constructors onto new lines in the same
manner as modifiers if the function declaration is long or hard to read.

Yes:

```solidity
    // SPDX-License-Identifier: GPL-3.0
    pragma solidity >=0.7.0 <0.9.0;
    // Base contracts just to make this compile
    contract B {
        constructor(uint) {
        }
    }


    contract C {
        constructor(uint, uint) {
        }
    }


    contract D {
        constructor(uint) {
        }
    }


    contract A is B, C, D {
        uint x;

        constructor(uint param1, uint param2, uint param3, uint param4, uint param5)
            B(param1)
            C(param2, param3)
            D(param4)
        {
            // do something with param5
            x = param5;
        }
    }
```

No:

```solidity
    // SPDX-License-Identifier: GPL-3.0
    pragma solidity >=0.7.0 <0.9.0;

    // Base contracts just to make this compile
    contract B {
        constructor(uint) {
        }
    }


    contract C {
        constructor(uint, uint) {
        }
    }


    contract D {
        constructor(uint) {
        }
    }


    contract A is B, C, D {
        uint x;

        constructor(uint param1, uint param2, uint param3, uint param4, uint param5)
        B(param1)
        C(param2, param3)
        D(param4) {
            x = param5;
        }
    }


    contract X is B, C, D {
        uint x;

        constructor(uint param1, uint param2, uint param3, uint param4, uint param5)
            B(param1)
            C(param2, param3)
            D(param4) {
                x = param5;
            }
    }
```

When declaring short functions with a single statement, it is permissible to do it on a single line.

Permissible:

```solidity
    function shortFunction() public { doSomething(); }
```

These guidelines for function declarations are intended to improve readability.
Authors should use their best judgment as this guide does not try to cover all
possible permutations for function declarations.

## Mappings

In variable declarations, do not separate the keyword ``mapping`` from its
type by a space. Do not separate any nested ``mapping`` keyword from its type by
whitespace.

Yes:

```solidity
    mapping(uint => uint) map;
    mapping(address => bool) registeredAddresses;
    mapping(uint => mapping(bool => Data[])) public data;
    mapping(uint => mapping(uint => s)) data;
```

No:

```solidity
    mapping (uint => uint) map;
    mapping( address => bool ) registeredAddresses;
    mapping (uint => mapping (bool => Data[])) public data;
    mapping(uint => mapping (uint => s)) data;
```

## Variable Declarations

Declarations of array variables should not have a space between the type and
the brackets.

Yes:

```solidity
    uint[] x;
```

No:

```solidity
    uint [] x;
```

## Other Recommendations

Strings should be quoted with double-quotes instead of single-quotes.

Yes:

```solidity
    str = "foo";
    str = "Hamlet says, 'To be or not to be...'";
```

No:

```solidity
    str = 'bar';
    str = '"Be yourself; everyone else is already taken." -Oscar Wilde';
```

Surround operators with a single space on either side.

Yes:

```solidity
    :force:

    x = 3;
    x = 100 / 10;
    x += 3 + 4;
    x |= y && z;
```

No:

```solidity
    :force:

    x=3;
    x = 100/10;
    x += 3+4;
    x |= y&&z;
```

Operators with a higher priority than others can exclude surrounding
whitespace in order to denote precedence.  This is meant to allow for
improved readability for complex statements. You should always use the same
amount of whitespace on either side of an operator:

Yes:

```solidity
    x = 2**3 + 5;
    x = 2*y + 3*z;
    x = (a+b) * (a-b);
```

No:

```solidity
    x = 2** 3 + 5;
    x = y+z;
    x +=1;
```

## Order of Layout

Layout contract elements in the following order:

1. Pragma statements
2. Import statements
3. Interfaces
4. Libraries
5. Contracts

Inside each contract, library or interface, use the following order:

1. Type declarations
2. State variables
3. Events
4. Errors
5. Modifiers
6. Functions

note

    It might be clearer to declare types close to their use in events or state
    variables.


Yes:

```solidity
    // SPDX-License-Identifier: GPL-3.0
    pragma solidity >=0.8.4 <0.9.0;

    abstract contract Math {
        error DivideByZero();
        function divide(int256 numerator, int256 denominator) public virtual returns (uint256);
    }
```

No:

```solidity
    // SPDX-License-Identifier: GPL-3.0
    pragma solidity >=0.8.4 <0.9.0;

    abstract contract Math {
        function divide(int256 numerator, int256 denominator) public virtual returns (uint256);
        error DivideByZero();
    }
```

## Naming Conventions

Naming conventions are powerful when adopted and used broadly.  The use of
different conventions can convey significant *meta* information that would
otherwise not be immediately available.

The naming recommendations given here are intended to improve the readability,
and thus they are not rules, but rather guidelines to try and help convey the
most information through the names of things.

Lastly, consistency within a codebase should always supersede any conventions
outlined in this document.


### Naming Styles

To avoid confusion, the following names will be used to refer to different
naming styles.

* ``b`` (single lowercase letter)
* ``B`` (single uppercase letter)
* ``lowercase``
* ``UPPERCASE``
* ``UPPER_CASE_WITH_UNDERSCORES``
* ``CapitalizedWords`` (or CapWords)
* ``mixedCase`` (differs from CapitalizedWords by initial lowercase character!)

.. note:: When using initialisms in CapWords, capitalize all the letters of the initialisms. Thus HTTPServerError is better than HttpServerError. When using initialisms in mixedCase, capitalize all the letters of the initialisms, except keep the first one lower case if it is the beginning of the name. Thus xmlHTTPRequest is better than XMLHTTPRequest.


### Names to Avoid

* ``l`` - Lowercase letter el
* ``O`` - Uppercase letter oh
* ``I`` - Uppercase letter eye

Never use any of these for single letter variable names.  They are often
indistinguishable from the numerals one and zero.


### Contract and Library Names

* Contracts and libraries should be named using the CapWords style. Examples: ``SimpleToken``, ``SmartBank``, ``CertificateHashRepository``, ``Player``, ``Congress``, ``Owned``.
* Contract and library names should also match their filenames.
* If a contract file includes multiple contracts and/or libraries, then the filename should match the *core contract*. This is not recommended however if it can be avoided.

As shown in the example below, if the contract name is ``Congress`` and the library name is ``Owned``, then their associated filenames should be ``Congress.sol`` and ``Owned.sol``.

Yes:

```solidity
    // SPDX-License-Identifier: GPL-3.0
    pragma solidity >=0.7.0 <0.9.0;

    // Owned.sol
    contract Owned {
        address public owner;

        modifier onlyOwner {
            require(msg.sender == owner);
            _;
        }

        constructor() {
            owner = msg.sender;
        }

        function transferOwnership(address newOwner) public onlyOwner {
            owner = newOwner;
        }
    }
```
and in ``Congress.sol``:

```solidity
    // SPDX-License-Identifier: GPL-3.0
    pragma solidity >=0.4.0 <0.9.0;

    import "./Owned.sol";


    contract Congress is Owned, TokenRecipient {
        //...
    }
```

No:

```solidity
    // SPDX-License-Identifier: GPL-3.0
    pragma solidity >=0.7.0 <0.9.0;

    // owned.sol
    contract owned {
        address public owner;

        modifier onlyOwner {
            require(msg.sender == owner);
            _;
        }

        constructor() {
            owner = msg.sender;
        }

        function transferOwnership(address newOwner) public onlyOwner {
            owner = newOwner;
        }
    }
```
and in ``Congress.sol``:

```solidity
    // SPDX-License-Identifier: GPL-3.0
    pragma solidity ^0.7.0;


    import "./owned.sol";


    contract Congress is owned, tokenRecipient {
        //...
    }
```

### Struct Names

Structs should be named using the CapWords style. Examples: ``MyCoin``, ``Position``, ``PositionXY``.


### Event Names

Events should be named using the CapWords style. Examples: ``Deposit``, ``Transfer``, ``Approval``, ``BeforeTransfer``, ``AfterTransfer``.


### Function Names

Functions should use mixedCase. Examples: ``getBalance``, ``transfer``, ``verifyOwner``, ``addMember``, ``changeOwner``.


### Function Argument Names

Function arguments should use mixedCase. Examples: ``initialSupply``, ``account``, ``recipientAddress``, ``senderAddress``, ``newOwner``.

When writing library functions that operate on a custom struct, the struct
should be the first argument and should always be named ``self``.


### Local and State Variable Names

Use mixedCase. Examples: ``totalSupply``, ``remainingSupply``, ``balancesOf``, ``creatorAddress``, ``isPreSale``, ``tokenExchangeRate``.


### Constants

Constants should be named with all capital letters with underscores separating
words. Examples: ``MAX_BLOCKS``, ``TOKEN_NAME``, ``TOKEN_TICKER``, ``CONTRACT_VERSION``.


### Modifier Names

Use mixedCase. Examples: ``onlyBy``, ``onlyAfter``, ``onlyDuringThePreSale``.


### Enums

Enums, in the style of simple type declarations, should be named using the CapWords style. Examples: ``TokenGroup``, ``Frame``, ``HashStyle``, ``CharacterLocation``.


### Avoiding Naming Collisions

* ``singleTrailingUnderscore_``

This convention is suggested when the desired name collides with that of
an existing state variable, function, built-in or otherwise reserved name.

.. _style_guide_natspec:

*******
NatSpec
*******

Solidity contracts can also contain NatSpec comments. They are written with a
triple slash (``///``) or a double asterisk block (``/** ... */``) and
they should be used directly above function declarations or statements.

For example, the contract from :ref:`a simple smart contract <simple-smart-contract>` with the comments
added looks like the one below:

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

/// @author The Solidity Team
/// @title A simple storage example
contract SimpleStorage {
    uint storedData;

    /// Store `x`.
    /// @param x the new value to store
    /// @dev stores the number in the state variable `storedData`
    function set(uint x) public {
        storedData = x;
    }

    /// Return the stored value.
    /// @dev retrieves the value of the state variable `storedData`
    /// @return the stored value
    function get() public view returns (uint) {
        return storedData;
    }
}
```


---
# Typescript
---

## Overview

  - All files MUST be formatted with Prettier.
  - Files with a default export MUST be named equivalently to the symbol (class, function, interface, constant) that they export.
  - Interfaces must start with `I`.
  - Method names SHOULD be declared in camelCase.
  - Static class properties MUST be declared in all upper case with underscore separators.
  - const MUST be used where possible. Otherwise let MUST be used. var MUST NOT be used.
  - === MUST be used instead of ==. An exception is made for null checks, specifically someVar == null.
  - A file MUST NOT contain unused imports.
  - Test files MUST be located in a directory `test` and end with the extension .test.ts or .test.js.
  - `console.log` and other built-in logging functions MUST NOT be used.

### Styling rules
---

All files MUST be formatted with Prettier.

- Code MUST use four spaces for indenting, not tabs.
- Opening braces for classes and functions MUST be on the same line.
- Control structure keywords MUST have one space after them; method and function calls MUST NOT.
- Opening braces for control structures MUST go on the same line, and closing braces MUST go on the next line after the body.
- Opening parentheses for control structures MUST NOT have a space after them, and closing parentheses for control structures MUST NOT have a space before.
- Lines MUST be 120 characters or less.
- Semicolons are REQUIRED.
- Strings SHOULD use double quotes " or Backtick quotes \`.
- Colons in object and interface declarations MUST NOT be preceded by a space and MUST be followed by a space.
- Object and array declarations MUST contain a trailing comma, if it is declared on multiple lines.

This example encompasses some of the rules above as a quick overview:

```typescript
/**
 * @copyright 2009-2018 Vanilla Forums Inc.
 * @license http://www.opensource.org/licenses/gpl-2.0.php GPLv2
 */

/**
 * The is the foo class that does foo.
 *
 * This is a longer description that spans multiple
 * lines.
 */
export default class SomeClass extends ParentClass implements ISome {

    /**
     * The is a method that does a thing.
     *
     * This is a longer description that spans multiple
     * lines.
     *
     * @param a Must be a full sentence if provided.
     * @param b Must be a full sentence if provided.
     *
     * @returns Must be a full sentence if provided.
     */
    public function sampleFunction(a: string, b?:  = string): boolean{
        if (a === b) {
            return bar();
        } else if (a > b) {
            return foo->bar(a);
        } else {
            return BazClass.bar(a, b);
        }
    }
}
```

## General

### Files
---

- All files MUST use the Unix LF (linefeed) line ending.
- All files MUST end with a single blank line.
- A file with a default export MUST be named the same as the export.
- Code MUST use only UTF-8 without BOM.

### Indenting
---

- Code MUST use an indent of four spaces, and MUST NOT use tabs for indenting.
- Using only spaces, and not mixing spaces with tabs, helps to avoid problems with diffs, patches, history, and annotations.

### Single and double quotes
---

- Strings SHOULD use double quotes " or back-tick quotes `.
- Strings MAY use double quotes if there are double quotes that would have to otherwise be escaped.

```typescript
// Good
"Something"
"OMG she's using double quotes!"
`This one uses backtick quotes and has ${numberOfVars} variables.`
'"Single quotes can work sometimes too!", he excaimed.'

// Bad
'Single quotes with no escaped characters'
'Definitely not single quotes if there\'s single quotes that need to be escaped.'
```

### Forbidden types
---

Use lower case primitive datatypes insted of camelcase, eg:
```typescript
boolean // not Boolean
number // not Number
...
```

## Class constants, properties, and methods

### Static class properties
---

Static class properties MUST be declared in all upper case with underscore separators.
```typescript
class Foo {
    public static VERSION = '1.0';
    public static DATE_APPROVED = '2012-06-01';
}
```

### Extends and Implements
---

The extends and implements keywords MUST be declared on the same line as the class name.
The opening brace for the class MUST go on the same line as the class name; the closing brace for the class MUST go on the next line after the body.

```typescript
class ClassName extends ParentClass implements ArrayAccess, Countable {
    // constants, properties, methods
}
```

Lists of implements MAY be split across multiple lines, where each subsequent line is indented once. When doing so, the first item in the list MUST be on the next line, and there MUST be only one interface per line.

```typescript
export default class ClassName extends ParentClass implements
    ArrayAccess,
    Countable,
    Serializable
{
    // constants, properties, methods
}
```

### Properties
---

- Visibility MUST be declared on all properties.
- A type declaration SHOULD be declared on all properties.
- There MUST NOT be more than one property declared per statement.
- Private properties SHOULD use the the private or protected visibility instead of prefixed with a single underscore. A single underscore MAY be used to denote an internal property that must still be exported, but should not be used elsewhere.
- A property declaration looks like the following:

```typescript
export default class ClassName {
    public foo = null;
}
```

### Methods
---

- Method names MUST be declared in camelCase().
- Visibility MUST be declared on all methods.
- Private methods SHOULD use the the private or protected visibility instead of prefixed with a single underscore. A single underscore MAY be used to denote a internal method that must still be exported, but should not be used elsewhere.
- Method names MUST NOT be declared with a space after the method name. The opening brace MUST go on the same line as the method name, and the closing brace MUST go on the next line following the body. There MUST NOT be a space after the opening parenthesis, and there MUST NOT be a space before the closing parenthesis.
- A method declaration looks like the following. Note the placement of parentheses, commas, spaces, and braces:

```typescript
export default class ClassName {
    public static function fooBarBaz(arg1: string, arg2: number , arg3?: IOptions[] = []) {
        // method body
    }
}
```

### Methods with a bound this context
---

- When passing a method as callback or as an event handler, it's often necessary to bind the context.
- The context SHOULD NOT be bound in the constructor or at the call site.
- The context SHOULD be bound by declaring the method as a class property with an arrow function:

```typescript
export default class ClassName {

    // This method will automatically have it's context bound as the class instance.
    public fooBarBaz = (arg1: string, arg2: number , arg3?: IOptions[] = []) => {
        // method body
    }
}
```

### abstract and static
---

- When present, the abstract declaration MUST precede the visibility declaration.
- When present, the static declaration MUST come after the visibility declaration.

## Variables, objects & functions

### Variable declarations
---

- `const` MUST be used where possible; otherwise, let MUST be used. var MUST NOT be used.
- Multiple variables MUST NOT be declared at once.

```typescript
// Good
const foo = "foo";
const bar = "bar";

// Bad
const foo = "foo",
    bar = "bar";

let thing1, thing2, thing3;
```

- Variables MUST be named in either lowerCamelCased or UPPER_CASED formatting.

### Objects
---

- Objects keys MUST NOT use quotes unless necessary.

```typescript
const object = {
    lookMa: "noQuotes",
    "quote-are-necessary-here",
}
```

- Object literal shorthand MUST be used where possible.

```typescript
const foo = "foo";
const bar = "bar";

// Good
const good = {
    foo,
    bar,
    other: "other",
};

// Bad
const bad = {
    foo: foo,
    bar: bar,
    other: "other",
};
```

The spread operator MUST be used instead of Object.assign.

```typescript
const thing1 = {
    foo: "foo",
};

const thing2 = {
    bar: "bar",
};

// Good
const good = {
    other: "other",
    ...thing1,
    ...thing2,
};

// Bad
const bad = Object.assign(
    {},
    thing1,
    thing2
);
```

### Declaring functions
---

- Functions MUST be declared as - An arrow function, - A named function, - A function declaration.
- Anonymous functions that are not an arrow function MUST NOT be used.

```typescript
// Good
function foo(event: ClickEvent) {}

const foo = function foo(event: ClickEvent) {};

const foo = (event: ClickEvent) => {};

document.addEventListener("click", (event: ClickEvent) => {})

document.addEventListener("click", foo);

// Bad
const foo = function() {};

document.addEventListener("click", function(event: ClickEvent) {})
```

### Calling Functions
---

When making a method or function call:

- There MUST NOT be a space between the method or function name and the opening parenthesis
- There MUST NOT be a space after the opening parenthesis
- There MUST NOT be a space before the closing parenthesis
- In the argument list, there MUST NOT be a space before each comma, and there MUST be one space after each comma.

```typescript
bar();
foo.bar(arg1);
Foo.baz(arg2, arg3);
```

- Argument lists MAY be split across multiple lines, where each subsequent line is indented once. When doing so, the first item in the list MUST be on the next line, and there MUST be only one argument per line.

```typescript
foo.bar(
    longArgument,
    longerArgument,
    muchLongerArgument,
);
```

## Control structures

The general style rules for control structures are listed below (many are automatically enforced by Prettier):

- There MUST be one space after the control structure keyword
- There MUST NOT be a space after the opening parenthesis
- There MUST NOT be a space before the closing parenthesis
- There MUST be one space between the closing parenthesis and the opening brace
- The structure body MUST be indented once
- The closing brace MUST be on the next line after the body
- The body of each structure MUST be enclosed by braces. This standardizes how the structures look, and reduces the likelihood of introducing errors as new lines get added to the body.

### if, else if, else
---

- An if structure example is shown below. Note the placement of parentheses, spaces, and braces, and that else and elseif are on the same line as the closing brace from the earlier body.

```typescript
if (expr1) {
    // if body
} else if (expr2) {
    // else if body
} else {
    // else body;
}
```

- The keyword elseif SHOULD be used instead of else if so that all control keywords look like single words.
- If statements MUST have opening and closing brackets and be split onto multiple lines. Single line if statements are prohibited.

### switch, case
---

- A switch structure example is shown below. Note the placement of parentheses, spaces, and braces.

```typescript
switch (expr) {
    case 0:
        doThing('First case, with a break');
        break;
    case 1:
        doThing('Second case, which falls through');
        // no break
    case 2:
    case 3:
    case 4:
        doThing('Third case, return instead of break');
        return;
    default:
        doThing('Default case');
        break;
}
```

- The case statement MUST be indented once from switch, and the break keyword (or other terminating keyword) MUST be indented at the same level as the case body.
- There MUST be a comment such as // no break when fall-through is intentional in a non-empty case body.

### for of, forEach, and for in
---

- for of and foreach are preferred over for in.

```typescript
const arrayVals = [1, 2, 3, 4];
const objectVals = {
    key: "value",
};

arrayVals.forEach(val => {
    // Do something
});

// Iterate over an object
for (const [key, value] of Object.entries(objectVals)) {
    // do something
}
```

 - A for in loop MUST contain a hasOwnProperty() check.

```typescript
for (const key in objectVals) {
    if (objectVals.hasOwnProperty(key)) {
        // Do something
    }
}
```

## Doc blocks

 - Classes MUST contain a description comment.
 - Class methods and properties MUST contain a visibility declaration.
 - All functions, except for anonymous functions, and all class methods, MUST contain a multi-line JSDoc style comment. This comment:
 - MUST contain a short description.
 - MAY contain an extended description.
 - MAY contain @param annotations.
 - MUST NOT contain type hints in its @param or @returns annoations. Type hints should be declared directly as part of the function signature.
 - MUST NOT align its @param descriptions by using additional spaces.
 - MAY contain a single @returns annotation.
