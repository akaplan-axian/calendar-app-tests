const Ajv = require('ajv');
const addFormats = require('ajv-formats');

class SchemaValidator {
  constructor(openApiSpec) {
    this.openApiSpec = openApiSpec;
    this.ajv = new Ajv({
      strict: false,
      validateFormats: true,
      addUsedSchema: false
    });
    
    // Add standard formats (including date-time)
    addFormats(this.ajv);
    
    // Add all schemas from the OpenAPI spec
    this.addSchemasFromSpec();
  }

  addSchemasFromSpec() {
    if (this.openApiSpec.components && this.openApiSpec.components.schemas) {
      Object.entries(this.openApiSpec.components.schemas).forEach(([name, schema]) => {
        try {
          this.ajv.addSchema(schema, `#/components/schemas/${name}`);
        } catch (error) {
          console.warn(`Warning: Could not add schema ${name}:`, error.message);
        }
      });
    }
  }

  validateResponse(path, method, statusCode, responseData) {
    const operation = this.getOperation(path, method);
    if (!operation) {
      throw new Error(`Operation not found for ${method.toUpperCase()} ${path}`);
    }

    const responseSchema = this.getResponseSchema(operation, statusCode);
    if (!responseSchema) {
      // If no schema is defined for this response, we can't validate it
      return {
        valid: true,
        message: `No schema defined for ${statusCode} response`
      };
    }

    const validate = this.ajv.compile(responseSchema);
    const valid = validate(responseData);

    return {
      valid,
      errors: validate.errors || [],
      schema: responseSchema
    };
  }

  getOperation(path, method) {
    // Find the path in the OpenAPI spec
    const pathItem = this.openApiSpec.paths[path];
    if (!pathItem) {
      return null;
    }

    return pathItem[method.toLowerCase()];
  }

  getResponseSchema(operation, statusCode) {
    const responses = operation.responses;
    if (!responses) {
      return null;
    }

    // Try exact status code first
    let response = responses[statusCode.toString()];
    
    // If not found, try default
    if (!response) {
      response = responses.default;
    }

    if (!response) {
      return null;
    }

    // Get the JSON schema from the response
    const content = response.content;
    if (!content || !content['application/json']) {
      return null;
    }

    return content['application/json'].schema;
  }

  getExpectedStatusCodes(path, method) {
    const operation = this.getOperation(path, method);
    if (!operation || !operation.responses) {
      return [];
    }

    return Object.keys(operation.responses)
      .filter(code => code !== 'default')
      .map(code => parseInt(code, 10))
      .filter(code => !isNaN(code));
  }

  getOperationId(path, method) {
    const operation = this.getOperation(path, method);
    return operation ? operation.operationId : null;
  }

  getAllPaths() {
    return Object.keys(this.openApiSpec.paths || {});
  }

  getMethodsForPath(path) {
    const pathItem = this.openApiSpec.paths[path];
    if (!pathItem) {
      return [];
    }

    const httpMethods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'];
    return httpMethods.filter(method => pathItem[method]);
  }

  getRequestSchema(path, method) {
    const operation = this.getOperation(path, method);
    if (!operation || !operation.requestBody) {
      return null;
    }

    const content = operation.requestBody.content;
    if (!content || !content['application/json']) {
      return null;
    }

    return content['application/json'].schema;
  }

  validateRequest(path, method, requestData) {
    const requestSchema = this.getRequestSchema(path, method);
    if (!requestSchema) {
      return {
        valid: true,
        message: 'No request schema defined'
      };
    }

    const validate = this.ajv.compile(requestSchema);
    const valid = validate(requestData);

    return {
      valid,
      errors: validate.errors || [],
      schema: requestSchema
    };
  }
}

module.exports = SchemaValidator;
