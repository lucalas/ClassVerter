# ClassVerter 0.1
Javascript library to convert from one class language to another

[ClassVerter](http://lucataddeo.altervista.org/ClassVerter/)

## Language available:
- C#
- Java
- Javascript
- Typescript
- PHP

## And format...:
- Json
- JsonSchema

## Api documentation:

```c
var converter = new Converter();
converter.convertToClass(ClassText, typeFrom, typeTo, { isProperty: isProperty, className: jsonClassName, doc: doc });
```

- ClassText -> Text class to convert

- typeFrom -> type of class to convert [JSON, JSONSCHEMA, PHP, C#, JAVA, TS]

- typeTo -> type of class converted [PHP, C#, JAVA, JS, TS, JSONSCHEMA]

{
- isProperty -> true/false | return set/get methods
- className -> name of the class, used only for JSON that doesn't have a classname
- doc -> true/false | Add comment tag for the properties

}


### Site:
[ClassVerter](http://lucataddeo.altervista.org/ClassVerter/)
