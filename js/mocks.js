const MOCK_RESPONSES = {
  dni: {
    success: {
      data: {
        dni: "V1010101010101",
        firstName: "Bot",
        middleName: "De Bot",
        lastName: "Core",
        secondLastName: "New",
        personalRif: "V1010101010101",
        sex: "M",
        maritalStatus: "Soltero",
        address: "0101010101",
        phone: "04120101010",
        email: "bot@gmail.com"
      },
      code: 200,
      message: "ok",
      extra_data: []
    },
    notFound: {
      data: {
        error: {
          internalError: "Informacion no encontrada",
          message: "Informacion no encontrada"
        },
        message: "Informacion no encontrada"
      },
      code: 404,
      message: "error",
      extra_data: []
    },
    validationError: {
      data: {
        error: {
          internalError: "tipo is a required parameter.",
          message: "tipo is a required parameter."
        },
        message: "tipo is a required parameter."
      },
      code: 400,
      message: "error",
      extra_data: []
    }
  },
  rif: {
    success: {
      data: {
        rif: "J411801674",
        name: "Soluciones Integrales Alpha 2020 C.A.",
        activity: "Venta Al Por Mayor De Equipos, Partes Y Accesorios De Computacion"
      },
      code: 200,
      message: "ok",
      extra_data: []
    },
    notFound: {
      data: {
        error: {
          internalError: "Informacion no encontrada",
          message: "Informacion no encontrada"
        },
        message: "Informacion no encontrada"
      },
      code: 404,
      message: "error",
      extra_data: []
    },
    validationError: {
      data: {
        error: {
          internalError: "tipo is a required parameter.",
          message: "tipo is a required parameter."
        },
        message: "tipo is a required parameter."
      },
      code: 400,
      message: "error",
      extra_data: []
    }
  }
};

async function mockFetch(url, options) {
  if (!CONFIG.USE_MOCKS) {
    return fetch(url, options);
  }

  const base = window.location.origin || "http://localhost";
  const urlObj = new URL(url, base);
  const path = urlObj.pathname;
  const params = urlObj.searchParams;

  await new Promise(resolve => setTimeout(resolve, CONFIG.MOCK_DELAY));

  if (path.includes("/consulta-rif")) {
    const tipo = params.get("tipo");
    const numero = params.get("numero");

    if (!tipo || !numero) {
      return mockResponse(MOCK_RESPONSES.rif.validationError);
    }

    if (numero === "000000000") {
      return mockResponse(MOCK_RESPONSES.rif.notFound);
    }

    return mockResponse(MOCK_RESPONSES.rif.success);
  }

  if (path.includes("/consulta")) {
    const tipo = params.get("tipo");
    const numero = params.get("numero");

    if (!tipo || !numero) {
      return mockResponse(MOCK_RESPONSES.dni.validationError);
    }

    if (numero === "00000000") {
      return mockResponse(MOCK_RESPONSES.dni.notFound);
    }

    return mockResponse(MOCK_RESPONSES.dni.success);
  }

  return mockResponse(MOCK_RESPONSES.dni.validationError);
}

function mockResponse(data) {
  return {
    ok: data.code >= 200 && data.code < 300,
    status: data.code,
    json: async () => data
  };
}
