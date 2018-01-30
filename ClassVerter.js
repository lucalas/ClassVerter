//
//  ClassVerter.js
//  This class helps to convert class from a language to another language.
//  Type supported:
//    - PHP
//    - C#
//    - JavaScript
//    - JAVA
//    - TypeScript
//    - JSONSchema
//    - JSON
//
//  - ATTENTION -
//  It isn't a definitive version, you could find some bugs, if you find, please report to me!
//
//  Created by Luca Taddeo
//  Version: 0.1
//

var ClassVerter = function(){

    var PHP = "PHP";
    var CSHARP = "C#";
    var JS = "JS";
    var JAVA = "JAVA";
    var TS = "TS";
    var JSONTEXT = "JSON";
    var JSONSCHEMA = "JSONSCHEMA";

    // These are the templates used to create response class
    var phpTemplate = {
        classHeader: "class {className}{space}{{space}\n",
        variable: {
            variableDoc: "/**\n *{variableDoc}\n **/\n",
            declarationVariable: "{variableAcModifier} {variableName}{space}",
            variableValue: "={space}{variableValue}{space}",
            variableClose: ";",
            variableMarker: "$"
        },
        property: {
            getDoc: "/**\n *{getDoc}\n **/\n",
            get: "function get{capVariableName}{\n return $this->{variableName}; \n}\n\n",
            setDoc: "/**\n *@Return {setDoc}\n **/\n",
            set: "function set{capVariableName}($new{capVariableName}){\n $this->{variableName} = $new{capVariableName}; \n}\n\n",
            isVariableClose: true
        },
        accessorModifiers: {
            public: "public",
            private: "private",
            protected: "protected"
        },
        variableTypes: {
            number: "Integer",
            array: "Array",
            string: "String",
            boolean: "boolean",
            object: "Object",
            unknown: "{variableType}"
        },
        variableNew: {
            number: { values: ["{numeric}"], default: 0 },
            array: { values: ["array()", "[]"], default: 0 },
            string: { values: ["\"{value}\""], default: 0 },
            boolean: { values: ["true", "false"], default: 0 },
            object: { values: ["new stdClass()"], default: 0 },
            unknown: { values: ["new {variableType}()"], default: 0 }
        },
        classFooter: "}"
    };

    var cSharpTemplate = {
        classHeader: "class {className}{space}{{space}\n",
        variable: {
            variableDoc: "/**\n *{variableDoc}\n **/\n",
            declarationVariable: "{variableAcModifier} {variableType} {variableName}{space}",
            variableValue: "={space}{variableValue}{space}",
            variableClose: ";",
            variableMarker: ""
        },
        property: {
            getDoc: "",
            get: " { get;",
            setDoc: "",
            set: " set; }\n\n",
            isVariableClose: false
        },
        accessorModifiers: {
            public: "public",
            private: "private",
            protected: "protected"
        },
        variableTypes: {
            number: "int",
            array: "List<{variableArrayType}>",
            string: "string",
            boolean: "bool",
            object: "object",
            unknown: "{variableType}"
        },
        variableNew: {
            number: { values: ["{numeric}"], default: 0 },
            array: { values: ["List<{variableArrayType}>()"], default: 0 },
            string: { values: ["\"{value}\""], default: 0 },
            boolean: { values: ["true", "false"], default: 0 },
            object: { values: ["new object()"], default: 0 },
            unknown: { values: ["new {variableType}()"], default: 0 }
        },
        classFooter: "}"
    };

    var javaTemplate = {
        classHeader: "class {className}{space}{{space}\n",
        variable: {
            variableDoc: "/**\n *{variableDoc}\n **/\n",
            declarationVariable: "{variableAcModifier} {variableType} {variableName}{space}",
            variableValue: "={space}{variableValue}{space}",
            variableClose: ";",
            variableMarker: ""
        },
        property: {
            getDoc: "/**\n *{getDoc}\n **/\n",
            get: "{variableType} get{capVariableName}{\n return this.{variableName}; \n}\n\n",
            setDoc: "/**\n *@Return {setDoc}\n **/\n",
            set: "void set{capVariableName}({variableType} new{capVariableName}){\n this.{variableName} = new{capVariableName}; \n}\n\n",
            isVariableClose: true
        },
        accessorModifiers: {
            public: "public",
            private: "private",
            protected: "protected"
        },
        variableTypes: {
            number: "int",
            array: "List<{variableArrayType}>",
            string: "String",
            boolean: "boolean",
            object: "Object",
            unknown: "{variableType}"
        },
        variableNew: {
            number: { values: ["{numeric}"], default: 0 },
            array: { values: ["new ArrayList<{variableArrayType}>()"], default: 0 },
            string: { values: ["\"{value}\""], default: 0 },
            boolean: { values: ["true", "false"], default: 0 },
            object: { values: ["new Object()"], default: 0 },
            unknown: { values: ["new {variableType}()"], default: 0 }
        },
        classFooter: "}"
    };

    var tsTemplate = {
        classHeader: "class {className}{space}{{space}\n",
        variable: {
            variableDoc: "/**\n *{variableDoc}\n **/\n",
            declarationVariable: "{variableAcModifier} {variableName}:{space}{variableType}{space}",
            variableValue: "={space}{variableValue}{space}",
            variableClose: ";",
            variableMarker: ""
        },
        property: {
            getDoc: "/**\n *{getDoc}\n **/\n",
            get: "function get{capVariableName}: {variableType}{\n return this.{variableName}; \n}\n\n",
            setDoc: "/**\n *@Return {setDoc}\n **/\n",
            set: "function set{capVariableName}(new{capVariableName}: {variableType}){\n this.{variableName} = new{capVariableName}; \n}\n\n",
            isVariableClose: true
        },
        accessorModifiers: {
            public: "public",
            private: "private",
            protected: "protected"
        },
        variableTypes: {
            number: "number",
            array: "Array<{variableArrayType}>",
            string: "string",
            boolean: "boolean",
            object: "any",
            unknown: "{variableType}"
        },
        variableNew: {
            number: { values: ["{numeric}"], default: 0 },
            array: { values: ["new Array<{variableArrayType}>()"], default: 0 },
            string: { values: ["\"{value}\""], default: 0 },
            boolean: { values: ["true", "false"], default: 0 },
            object: { values: ["{}"], default: 0 },
            unknown: { values: ["new {variableType}()"], default: 0 }
        },
        classFooter: "}"
    };

    var jsTemplate = {
        classHeader: "var {className} = function(){\n",
        variable: {
            variableDoc: "/**\n *{variableDoc}\n **/\n",
            declarationVariable: "{variableName}{space}",
            variableValue: "={space}{variableValue}{space}",
            variableClose: ";",
            variableMarker: "this."
        },
        property: {
            getDoc: "/**\n *{getDoc}\n **/\n",
            get: "this.get{capVariableName} = function(){\n return this.{variableName}; \n}\n\n",
            setDoc: "/**\n *@Return {setDoc}\n **/\n",
            set: "this.set{capVariableName} = function(new{capVariableName}){\n this.{variableName} = new{capVariableName}; \n}\n\n",
            isVariableClose: true
        },
        accessorModifiers: {
            public: "",
            private: "",
            protected: ""
        },
        variableTypes: {
            number: "number",
            array: "[]",
            string: "string",
            boolean: "boolean",
            object: "object",
            unknown: "{variableType}"
        },
        variableNew: {
            number: { values: ["{numeric}"], default: 0 },
            array: { values: ["new Array()"], default: 0 },
            string: { values: ["\"{value}\""], default: 0 },
            boolean: { values: ["true", "false"], default: 0 },
            object: { values: ["{}"], default: 0 },
            unknown: { values: ["{}"], default: 0 }
        },
        classFooter: "}"
    };

    /**
     * The unique exposed method to convert.
     * Convert a class or a format type (like json or jsonschema) into other class or format type.
     * @param {string} classText
     * @param {string} fromLanguage
     * @param {string} toLanguage
     * @param {Obj} settings
     **/
    this.convertToClass = function (classText, fromLanguage, toLanguage, settings) {
        try {
            var objectResult = {};
            var template = null;

            // Convert to js schema
            if (fromLanguage === PHP) {
                objectResult = convertClass(classText, phpTemplate);
            } else if (fromLanguage === CSHARP) {
                objectResult = convertClass(classText, cSharpTemplate);
            } else if (fromLanguage === JSONTEXT) {
                // FIXME ??
                objectResult = convertJSON({ className: settings.className, obj: JSON.parse(classText) });
            } else if (fromLanguage === JAVA) {
                objectResult = convertClass(classText, javaTemplate);
            } else if (fromLanguage === TS) {
                objectResult = convertClass(classText, tsTemplate);
            } else if (fromLanguage === JSONSCHEMA) {
                objectResult = JSON.parse(classText);
            }

            if (toLanguage === JSONSCHEMA) {
                return [JSON.stringify(objectResult)];
            } else {
                if (toLanguage === PHP) {
                    template = phpTemplate;
                } else if (toLanguage === CSHARP) {
                    template = cSharpTemplate;
                } else if (toLanguage === JAVA) {
                    template = javaTemplate;
                } else if (toLanguage === TS) {
                    template = tsTemplate;
                } else if (toLanguage === JS) {
                    template = jsTemplate;
                }
                // FIXME maybe we can change conversion without passing data to jsonschema?
                return convertJSONSchemaToClass(objectResult, template, settings);
            }
        } catch (ex) {
            // A big catch to capture every occured error (only to prevent reload of the page)
            return ["An error occured during conversion, exception: [" + ex + "]"];
        }
    };

    /**
     * Create a text format variable based on passed template, variable object, name, properties and documentation.
     * @param {templateType} template template to apply
     * @param {jsonSchema} variable variable to get value (object jsonschema type)
     * @param {string} variableName variable name
     * @param {object} settings
     */
    function composeTemplateToVariable(template, variable, variableName, settings) {
        // Set variable
        var variableDoc = "";
        var variableDeclaration = template.variable.declarationVariable;
        var variableValue = "";
        var variableClose = template.variable.variableClose;

        var variableProperties = "";
        var modifier = template.accessorModifiers.public;

        // Set doc
        if (!!settings.doc) {
            variableDoc = template.variable.variableDoc;
        }

        // Set value
        if (variable.default != null) {
            variableValue = template.variable.variableValue;
        }

        // Set property
        if (!!settings.isProperty) {
            modifier = template.accessorModifiers.private;
            var getDoc = "";
            var getValue = "";
            var setDoc = "";
            var setValue = "";

            if (settings.doc) {
                getDoc = template.property.getDoc;
                setDoc = template.property.setDoc;
            }

            getValue = template.property.get;
            setValue = template.property.set;

            if (!template.property.isVariableClose) {
                variableClose = "";
            }

            variableProperties = getDoc + getValue + setDoc + setValue;
        }

        variableTemplate = variableDoc + variableDeclaration + variableValue + variableClose + variableProperties;

        var variableDocValue = variable.description != null ? variable.description : "";

        var variableToReturn = replaceAll(variableTemplate, ["{variableDoc}", "{variableAcModifier}", "{variableType}", "{variableName}", "{capVariableName}", "{variableValue}", "{value}", "{numeric}", "{setDoc}", "{getDoc}", /*"{variableArrayType}",*/ "{space}"], [variableDocValue, modifier, getVariableType(template.variableTypes, variable), template.variable.variableMarker + variableName, capitalizeFirst(variableName), getVariableNew(variable), variable.default != null ? variable.default : "", variable.default != null ? variable.default : "", variableDocValue, variableDocValue/*, variable.items != null ? getVariableType(template.variableTypes, variable.items.type) : ""*/, ""]);

        return variableToReturn;

        function getVariableType(variableTypes, variable) {
            var currentType = variableTypes[variable.type] != null ? variableTypes[variable.type] : variableTypes.unknown.replace("{variableType}", variable.type);
            if (currentType.indexOf("{variableArrayType}") >= 0) {
                return replaceAll(currentType, ["{variableArrayType}"], [getVariableType(variableTypes, variable.items ? variable.items : { type: "unknown" })]);
            } else if (currentType.indexOf("{variableType}") >= 0) {
                currentType = replaceAll(currentType, ["{variableType}"], [variableTypes.object]);
                return currentType;
            } else {
                return currentType;
            }
        }

        function getVariableNew(variable) {
            var currentValueType = null;

            // Looking for a possible equals value (if the passed type exists)
            if (template.variableNew[variable.type]) {
                template.variableNew[variable.type].values.forEach((value) => {

                    // If there's one we set it to new variable value
                    if (value == variable.default) {
                        currentValueType = variable.default;
                    }
                });
            }

            // If no one value was found we set the default one
            if (!currentValueType) {
                // Looking for default if current variable type exists otherwise set default of unknown "type"
                if (template.variableNew[variable.type]) {
                    currentValueType = template.variableNew[variable.type].values[template.variableNew[variable.type].default];
                } else {
                    currentValueType = template.variableNew.unknown.values[template.variableNew.unknown.default];
                }
            }

            if (currentValueType) {
                if (currentValueType.indexOf("{variableArrayType}") >= 0) {
                    currentValueType = replaceAll(currentValueType, ["{variableArrayType}"], [getVariableType(template.variableTypes, variable.items ? variable.items : { type: "unknown" })]);
                } else if (currentValueType.indexOf("{variableType}") >= 0) {
                    currentValueType = replaceAll(currentValueType, ["{variableType}"], [template.variableNew.object.values[template.variableNew.object.default]]);
                }
            } else {
                currentValueType = "<Unable to set value>";
            }
            return currentValueType;
        }
    }

    function getClassName(classText, template) {
        var headerTemplate = template.classHeader;
        var replacedHeaderTemplate = replaceAll(headerTemplate, ["{className}", "{space}"], ["(.+)", "([\\s]*)"]) + "(.|\n)*";
        var className = "unknow";

        var verify = new RegExp(replacedHeaderTemplate);

        var res = verify.exec(classText);

        if (res != null) {
            var results = removeAllFromArray(res, [classText, ""]);

            var order = getAllPosition(headerTemplate, ["{className}"]);
            className = results[order[0]];
        }

        return className;
    }

    function convertClass(classText, template) {
        classText = removeUselessSpaces(classText);
        var className = getClassName(classText, template);//substringBetween(classText, "class", "{");
        var variables = {};
        var varToConvert = [];
        var checkpoint = "class " + className + "{";

        // Get all variables
        do {
            var variable = substringBetween(classText, checkpoint, ";");

            varToConvert.push(new Variable(variable + ";", template));
            checkpoint = variable + ";";
        } while (!substringBetween(classText, variable + ";", "}").trim().length == 0);

        varToConvert.forEach((variable, index) => {
            variables[variable.getName()] = variable.getGenericType();
            variables[variable.getName()]["default"] = variable.getValue();
        });

        return { title: className.trim(), type: "object", properties: variables };
    }

    /**
     * Convert json schema to class template passed as param.
     * @param {jsonSchema} jsonSchema jsonschema to convert
     * @param {templateType} template class template to apply
     * @param {object} settings
     * @return class in text format
     */
    function convertJSONSchemaToClass(jsonSchema, template, settings) {

        var header = replaceAll(template.classHeader, ["{className}", "{space}"], [jsonSchema.title, ""]);
        var body = "";
        var footer = template.classFooter;
        var variableTemplate = "";

        Object.keys(jsonSchema.properties).forEach((value) => {
            // compose variable
            body += composeTemplateToVariable(template, jsonSchema.properties[value], value, settings) + "\n";
        });

        return header + body + footer
    }

    /**
     * Convert JSON to json schema equivalent.
     * @param {className: 'string', obj: jsonObj} jsonObj
     * @return jsonSchema value
     */
    function convertJSON(jsonObj) {
        var objVariable = jsonObj.obj;
        var variables = {};

        Object.keys(objVariable).forEach((variableName, index) => {
            if (objVariable[variableName] instanceof Array) {
                variables[variableName] = { type: "array" };
            } else if (typeof objVariable[variableName] === "string") {
                variables[variableName] = { type: "string", default: objVariable[variableName] };
            } else if (typeof objVariable[variableName] === "number") {
                variables[variableName] = { type: "number", default: objVariable[variableName] };
            } else if (typeof objVariable[variableName] === "boolean") {
                variables[variableName] = { type: "boolean", default: objVariable[variableName] + ""};
            } else if (typeof objVariable[variableName] === "object") {
                variables[variableName] = { type: "object", default: objVariable[variableName] };
            }
            console.log(variables[variableName]);
        });

        return { title: jsonObj.className, type: "object", properties: variables };
    }
}

var Class = function (text, template) {
}

var Variable = function (text, template) {
    var validSintax = false;
    var textVariable = text.trim();
    var templateVariable = template;
    var accessModifier = "";
    var type = "";
    var name = "";
    var value = null;
    var genericType = "";

    // Regex
    var spaceMandatoryReg = "([\\s]+)";
    var spaceNotMandatoryReg = "([\\s]*)";
    var accessModifierReg = "^([" + templateVariable.accessorModifiers.private + "|" + templateVariable.accessorModifiers.public + "|" + templateVariable.accessorModifiers.protected + "]+)";
    var typeReg = "([[a-zA-Z0-9<>]+)";
    var nameReg = "([[a-zA-Z0-9]+)";
    var valueReg = "(.+)"; // FIXME restrict value
    var equalsReg = "([=]+)";
    var closeReg = "([" + templateVariable.variable.variableClose + "]+)";
    var markerReg = templateVariable.variable.variableMarker.length > 0 ? "([" + templateVariable.variable.variableMarker + "]+)" : "";

    createVariable();

    function createVariable() {
        var isValid = true;

        isValid = createVariableWithValue();
        if (!isValid) {
            isValid = createVariableWithoutValue();
        }

        validSintax = isValid;
    };

    function getExactValue(genericValue) {
        var currentValue = genericValue;
        var varTemplate = templateVariable.variableNew[genericType.type].values;

        var isValidValue = false;
        var counter = 0;

        while (!isValidValue && counter < varTemplate.length) {
            var valueTemplate = varTemplate[counter];
            var tempValueReg = "^" + replaceAll(RegExp.escape(valueTemplate), ["{value}", "{numeric}", "{space}"], ["(.*)", "(.*)", spaceNotMandatoryReg]) + "$";

            var verify = new RegExp(tempValueReg);

            var res = verify.exec(currentValue);
            isValidValue = res != null;

            if (isValidValue) {
                var results = null;
                results = removeAllFromArray(res, [currentValue, ""]);

                // If all results are removed means that it's a simple value that contain only '{value}' in string
                if (results.length > 0) {
                    // FIXME understand how to set value if is an array or boolean
                    var order = getAllPosition(valueTemplate, ["{value}", "{numeric}"]);
                    if (order[0] > -1) {
                        currentValue = results[order[0]];
                    } else {
                        currentValue = results[order[1]];
                    }
                }
            }
            counter++;
        }

        if (!isValidValue) {
            // TODO unknown value
        }

        return currentValue;

    }

    function createVariableWithValue() {
        var success = false;
        accessModifier = getAccessModifierFromText();
        var variableTemplate = templateVariable.variable.declarationVariable + templateVariable.variable.variableValue + closeReg;
        if (!hasAccessModifier()) {
            variableTemplate = replaceAll(variableTemplate, ["{variableAcModifier} "], [""]);
        }
        var parser = new TemplateParser();
        variableTemplate = removeUselessSpaces(variableTemplate);
        textVariable = removeUselessSpaces(textVariable);
        var replacedVarTemplate = parser.parse(variableTemplate, templateVariable);//replaceAll(variableTemplate, ["{variableAcModifier}", "{variableName}", "{variableType}", "=", "{variableValue}", "{space}"], [currentAMReg, markerReg + nameReg, typeReg, equalsReg, valueReg, spaceNotMandatoryReg]);
        //replacedVarTemplate = "^" + replaceAll(replacedVarTemplate.trim(), [" "], [spaceMandatoryReg]) + "$";

        var verify = new RegExp(replacedVarTemplate);
        var res = verify.exec(textVariable);

        if (res != null) {
            var results = removeAllFromArray(res, [templateVariable.variable.variableMarker, "=", templateVariable.variable.variableClose, textVariable, "", " "]);
            variableTemplate = hasAccessModifier() ? variableTemplate : replaceAll(variableTemplate, ["{variableAcModifier}"], [""]);
            var order = getAllPosition(variableTemplate, ["{variableAcModifier}", "{variableName}", "{variableType}", "{variableValue}"]);
            accessModifier = order[0] >= 0 ? results[order[0]] : "";
            name = order[1] >= 0 ? results[order[1]] : "";

            // if there is a type
            if (order[2] >= 0) {
                type = findType(results[order[2]]);
            } else {
                type = findTypeByValue(results[order[3]]);//tryFindTypeByValue(value);
            }

            genericType = findGenericType(type.type);
            value = order[3] >= 0 ? getExactValue(results[order[3]]) : "";
            success = true;
        }

        return success;
    }

    function createVariableWithoutValue() {
        var success = false;
        var variableTemplate = templateVariable.variable.declarationVariable + closeReg;
        var currentAMReg = hasAccessModifier() ? accessModifierReg : "";

        var replacedVarTemplate = replaceAll(variableTemplate, ["{variableAcModifier}", "{variableName}", "{variableType}", "{space}"], [currentAMReg, markerReg + nameReg, typeReg, spaceNotMandatoryReg]);
        replacedVarTemplate = "^" + replaceAll(replacedVarTemplate.trim(), [" "], [spaceMandatoryReg]) + "$";
        var verify = new RegExp(replacedVarTemplate);
        var res = verify.exec(textVariable);

        if (res != null) {
            var results = removeAllFromArray(res, [templateVariable.variable.variableMarker, templateVariable.variable.variableClose, textVariable, "", " "]);
            variableTemplate = hasAccessModifier() ? variableTemplate : replaceAll(variableTemplate, ["{variableAcModifier}"], [""]);
            var order = getAllPosition(variableTemplate, ["{variableAcModifier}", "{variableName}", "{variableType}"]);
            accessModifier = order[0] >= 0 ? results[order[0]] : "";
            name = order[1] >= 0 ? results[order[1]] : "";
            type = order[2] >= 0 ? findType(results[order[2]]) : { type: template.variableTypes.object };
            genericType = findGenericType(type.type);
            success = true;
        }

        return success;
    }

    function findType(currentType) {
        var newType = null;
        var keyTypes = Object.keys(templateVariable.variableTypes);
        var i = 0;

        while (i < keyTypes.length && newType == null) {
            var currentGenericType = keyTypes[i];
            var currentTemplateType = "^" + templateVariable.variableTypes[currentGenericType] + "$";

            var currentReplacedType = replaceAll(currentTemplateType, ["{variableArrayType}"], ["(.+)"]);

            var verify = new RegExp(currentReplacedType);
            var res = verify.exec(currentType);
            if (res != null) {
                var result = removeAllFromArray(res, [currentType, "", " "]);
                var order = getAllPosition(currentTemplateType, ["{variableArrayType}"]);
                // If it is an array (because it contains anchor variablearraytype)
                if (order[0] != -1) {
                    newType = { type: currentType, items: findType(result[order[0]]) };
                } else {
                    newType = { type: currentType };
                }
            }
            i++;
        }

        if (newType == null) {
            newType = "object";
        }

        return newType;
    }

    function findTypeByValue(value) {
        var findedType = null;


        var keyTypes = Object.keys(templateVariable.variableTypes);

        var i = 0;

        while (i < keyTypes.length && findedType == null) {
            var currentGenericType = keyTypes[i];
            var j = 0;
            while (j < templateVariable.variableNew[currentGenericType].values.length && findedType == null) {
                var currentTemplateValue = "^" + templateVariable.variableNew[currentGenericType].values[j] + "$";

                var currentReplacedValue = replaceAll(RegExp.escape(currentTemplateValue), ["{value}", "{numeric}"], ["(.*)", "([0-9]+)"]);

                var verify = new RegExp(currentReplacedValue);
                var res = verify.exec(value);
                if (res != null) {
                    findedType = { type: templateVariable.variableTypes[currentGenericType] };
                    //var result = removeAllFromArray(res, [currentType, "", " "]);
                    //var order = getAllPosition(currentTemplateType, ["{variableArrayType}"]);
                    // If it is an array (because it contains anchor variablearraytype)
                    /*if (order[0] != -1) {
                        newType = { type: currentType, items: findType(result[order[0]]) };
                    } else {
                        newType = { type: currentType };
                    }*/
                }
                j++;
            }
            i++;
        }

        return findedType;
    }

    function findGenericType(currentType) {
        var newType = null;
        var keyTypes = Object.keys(templateVariable.variableTypes);
        var i = 0;

        while (i < keyTypes.length && newType == null) {
            var currentGenericType = keyTypes[i];
            var currentTemplateType = templateVariable.variableTypes[currentGenericType];

            var currentReplacedType = "^" + replaceAll(currentTemplateType, ["{variableArrayType}"], ["(.+)"]) + "$";

            var verify = new RegExp(currentReplacedType);
            var res = verify.exec(currentType);

            if (res != null) {
                var result = removeAllFromArray(res, [currentType, "", " "]);
                var order = getAllPosition(currentTemplateType, ["{variableArrayType}"]);

                // If template type contain {variableArrayType} means that is an array so we have to find type of array
                if (order[0] != -1) {
                    newType = { type: currentGenericType, items: findGenericType(result[order[0]]) };
                } else {
                    newType = { type: currentGenericType };
                }
            }
            i++;
        }

        // FIXME if is a class type we should set the correct type, setting object type we are going to lose the type
        if (newType == null) {
            newType = { type: "object" };
        }

        return newType;
    }

    function getAccessModifierFromText() {
        if (textVariable.indexOf(templateVariable.accessorModifiers.private + " ") === 0)
            return templateVariable.accessorModifiers.private;
        if (textVariable.indexOf(templateVariable.accessorModifiers.public + " ") === 0)
            return templateVariable.accessorModifiers.public;
        if (textVariable.indexOf(templateVariable.accessorModifiers.protected) === 0)
            return templateVariable.accessorModifiers.protected;

        return "";
    }

    function hasAccessModifier(){
        return accessModifier != null && accessModifier.length > 0;
    };

    this.getName = function () {
        return name;
    }

    this.getType = function () {
        return type;
    }

    this.getAccessModifier = function () {
        return accessModifier;
    }

    this.getValue = function () {
        return value;
    }

    this.validVariable = function () {
        return validSintax;
    }

    this.getGenericType = function () {
        // TODO return generic type
        return genericType;
    }

    this.toJSONSchema = function () {
        // TODO convert to jsonschema
    }
}

var TemplateParser = function () {
    this.parse = function (value, template) {
        var parserValues = getKeysToReg(template);

        // FIME object.values non esiste, trovare il metodo giusto
        var tempValueReg = "^" + replaceAll(value, Object.keys(parserValues), objValue(parserValues)) + "$";

        return tempValueReg;
    }

    function getKeysToReg(template) {
        var markerReg = template.variable.variableMarker.length > 0 ? "([" + template.variable.variableMarker + "]+)" : "";

        var keysToReg = {
            "{className}": "(.+)",
            "{space}": "([\\s]*)",
            "{variableDoc}": "(.*)",
            "{variableAcModifier}": "([" + template.accessorModifiers.private + "|" + template.accessorModifiers.public + "|" + template.accessorModifiers.protected + "]+)", //runtime
            "{variableName}": markerReg + "([[a-zA-Z0-9]+)",   // runtime marker + ([[a-zA-Z0-9]+)
            "{variableValue}": "(.+)", // FIXME restrict value
            "{getDoc}": "",
            "{capVariableName}": "",
            "{setDoc}": "",
            "{numeric}": "([\\d]+)",
            "{value}": "(.*)",
            "{variableArrayType}": "(.+)",
            "{variableType}":"([[a-zA-Z0-9<>]+)",
            " ": "([\\s]+)"
        };

        return keysToReg;
    }
}

//*************
// UTILITIES
//*************
function substringBetween(textValue, startAnchor, endAnchor) {
    var startI = textValue.indexOf(startAnchor) != -1 ? textValue.indexOf(startAnchor) + startAnchor.length : -1;
    if (startI != -1) {
        var endI = -1;
        if (textValue === endAnchor) {
            endI = undefined;
        } else if (textValue.substr(startI).indexOf(endAnchor) != -1) {
            endI = textValue.substr(startI).indexOf(endAnchor) + startI;
        }

        if (endI != -1) {
            return textValue.substring(startI, endI);
        } else {
            return null;
        }
    } else {
        return null;
    }
}

function replaceAll(text, keys, values) {

    keys.forEach((key, i) => {
        text = text.replace(new RegExp(key, 'g'), values[i]);
    });

    return text;

}

function isNumber(value) {
    return /^\d+$/.test(value);
}

function capitalizeFirst(value) {
    return value.replace(/\b\w/g, l => l.toUpperCase())
}

function removeUselessSpaces(text) {
    return text.replace(/\t\s\s+/g, ' ');
}

function getAllPosition(text, keys) {
    var app = new Array();
    var ordered = new Array();

    keys.forEach((key, index) => {
        var position = text.indexOf(key);
        app.push(position);
    });

    var copyApp = app.slice();

    while(app.length > 0) {
        ordered.push(getPosition(copyApp, app.pop()));
    }

    return ordered.reverse();

    function getPosition(array, index) {
        var pos = 0;
        if (index >= 0) {
            array.forEach((value, i) => {
                if (value >= 0 && value < index && value != index) {
                    pos++;
                }
            });
        } else {
            pos = -1;
        }

        return pos;
    }
}

function removeFromArray(array, value) {
    while (array.indexOf(value) >= 0) {
        var index = array.indexOf(value);
        array.splice(index, 1);
    }

    return array;
}

function removeAllFromArray(array, values) {
    values.forEach((value, i) => {
        array = removeFromArray(array, value);
    });

    return array;
}

function objValue(obj) {
    return Object.keys(obj).map(key => obj[key]);
}

RegExp.escape = function (string) {
    return string.replace(/[()[\]]/g, '\\$&')
};
