export const environment = {
  emailService: {
    serviceId: 'service_xxxxx',
    templateId: 'template_xxxxx',
    publicKey: 'xxxxxxxx'
  },
  wompi: {
    /** Llave pública de Wompi (no es secreta). En CI se toma de la variable de repo WOMPI_PUBLIC_KEY. */
    publicKey: 'pub_prod_l8v3aNkH3MvmxovBogKpvspBNt8RK4wY',
    /** API de Ñapa (Render) que firma el monto con el secreto de integridad. */
    signatureUrl: 'https://napa-api.onrender.com/api/wompi/signature',
    redirectUrl: 'https://jfredmc.github.io/',
  },
};
