class ApiResponse {
  #status = null;
  #message = null;

  constructor(message, status) {
    this.#message = message;
    this.#status = status;
  }

  static Builder = class {
    #status = null;
    #message = null;

    setMessage(message) {
      this.#message = message;
      return this;
    }

    setStatus(status) {
      this.#status = status;
      return this;
    }

    ok() {
      this.#status = 200;
      return this;
    }

    notFound() {
      this.#status = 404;
      return this;
    }

    build() {
      const apiResponse = new ApiResponse(this.#message, this.#status);
      return apiResponse;
    }
  };

  toJSON() {
    return JSON.stringify({
      message: this.#message,
      status: this.#status,
    });
  }
}

module.exports = ApiResponse;
