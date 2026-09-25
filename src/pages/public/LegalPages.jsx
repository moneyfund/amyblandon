import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';

const updated = '25 de septiembre de 2026';

function LegalLayout({ eyebrow, title, intro, children }) {
  return (
    <section className="legal-page">
      <SEO title={`${title} | Amy Blandón`} description={intro} />
      <div className="legal-page__hero">
        <div className="legal-page__shell">
          <p className="legal-page__eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{intro}</p>
          <small>Última actualización: {updated}</small>
        </div>
      </div>
      <div className="legal-page__shell legal-page__content">
        {children}
        <div className="legal-page__closing">
          <p>Si tienes preguntas sobre este documento, puedes comunicarte mediante los canales oficiales publicados en este sitio.</p>
          <Link to="/contacto">Ir a contacto</Link>
        </div>
      </div>
    </section>
  );
}

function Section({ title, children }) {
  return (
    <section className="legal-page__section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function PrivacyPolicy() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Política de privacidad"
      intro="Esta política explica cómo se recopila, utiliza, conserva y protege la información que una persona comparte al utilizar amyblandon.com y sus formularios relacionados."
    >
      <Section title="1. Alcance">
        <p>Esta Política de privacidad aplica al sitio web amyblandon.com, sus formularios públicos, páginas de propiedades, solicitudes de contacto, consultas inmobiliarias y demás funcionalidades que enlacen a este documento. No regula sitios, plataformas o servicios de terceros a los que el usuario pueda acceder mediante enlaces externos.</p>
      </Section>

      <Section title="2. Información que puede recopilarse">
        <p>Dependiendo de la interacción del usuario con el sitio, pueden recopilarse datos de identificación y contacto, como nombre, correo electrónico, número telefónico, contenido de mensajes, preferencias inmobiliarias y cualquier información que la persona decida proporcionar voluntariamente en un formulario.</p>
        <p>También pueden generarse datos técnicos necesarios para el funcionamiento y seguridad del sitio, como dirección IP, tipo de navegador, dispositivo, fecha y hora de acceso, páginas consultadas, registros de errores, identificadores técnicos y datos similares. Cuando el usuario utiliza servicios de terceros integrados en el sitio, dichos proveedores pueden tratar información conforme a sus propias políticas.</p>
      </Section>

      <Section title="3. Finalidades del tratamiento">
        <p>La información puede utilizarse para atender consultas; dar seguimiento a solicitudes de compra, venta, renta o asesoría; coordinar visitas; preparar comunicaciones solicitadas por el usuario; administrar relaciones con clientes y prospectos; mejorar la experiencia y seguridad del sitio; prevenir usos abusivos o fraudulentos; mantener registros operativos; y cumplir obligaciones legales o requerimientos válidos de autoridad cuando correspondan.</p>
        <p>No se utilizarán los datos para finalidades incompatibles con las descritas sin informar previamente al usuario cuando ello resulte necesario.</p>
      </Section>

      <Section title="4. Formularios y comunicaciones">
        <p>El envío de un formulario no crea por sí mismo una relación contractual, mandato, promesa de compraventa, reserva de inmueble, aprobación financiera ni obligación de prestar un servicio. La información proporcionada sirve para iniciar o continuar una comunicación y deberá ser verificada cuando sea relevante para una operación.</p>
      </Section>

      <Section title="5. Cookies, almacenamiento local y tecnologías similares">
        <p>El sitio puede utilizar cookies, almacenamiento local u otras tecnologías estrictamente necesarias para recordar preferencias, mantener sesiones, ofrecer funciones del sitio, medir funcionamiento o reforzar seguridad. Algunas integraciones técnicas pueden ser provistas por terceros. El usuario puede limitar ciertas tecnologías desde la configuración de su navegador, aunque hacerlo puede afectar algunas funcionalidades.</p>
      </Section>

      <Section title="6. Proveedores tecnológicos y transferencias">
        <p>Para operar el sitio pueden utilizarse proveedores de alojamiento, bases de datos, almacenamiento, autenticación, correo, analítica, mapas, mensajería u otros servicios tecnológicos. Estos proveedores pueden procesar información en centros de datos ubicados fuera de Nicaragua. Se procura utilizar servicios reconocidos y configuraciones razonables de seguridad, pero ningún sistema conectado a internet puede garantizar riesgo cero.</p>
      </Section>

      <Section title="7. Conservación de la información">
        <p>Los datos se conservarán durante el tiempo razonablemente necesario para atender la finalidad para la que fueron obtenidos, mantener continuidad comercial, resolver consultas o controversias, cumplir obligaciones aplicables y proteger intereses legítimos relacionados con la operación del sitio. Cuando la información deje de ser necesaria, podrá eliminarse, anonimizarse o conservarse únicamente cuando exista una razón válida para hacerlo.</p>
      </Section>

      <Section title="8. Seguridad">
        <p>Se aplican medidas administrativas y técnicas razonables orientadas a proteger la información frente a acceso no autorizado, pérdida, alteración o divulgación indebida. Sin embargo, el usuario reconoce que las transmisiones por internet, dispositivos personales, cuentas de correo y servicios de terceros pueden estar expuestos a incidentes fuera del control directo de la titular del sitio.</p>
        <p>Si se detecta un incidente relevante, se podrán adoptar acciones de contención, investigación y corrección, así como realizar las comunicaciones que correspondan según la naturaleza del evento y la normativa aplicable.</p>
      </Section>

      <Section title="9. Derechos y solicitudes del usuario">
        <p>Una persona puede solicitar, según resulte aplicable, información sobre los datos que ha proporcionado, su actualización o corrección, y la eliminación de información que ya no sea necesaria o que pueda eliminarse legalmente. La solicitud podrá requerir verificación razonable de identidad para evitar que datos personales sean entregados o modificados por terceros no autorizados.</p>
      </Section>

      <Section title="10. Menores de edad">
        <p>Este sitio está dirigido principalmente a personas con capacidad para realizar consultas comerciales e inmobiliarias. No se busca recopilar deliberadamente información personal de menores de edad. Si un representante legal considera que un menor ha proporcionado información de manera inapropiada, puede solicitar su revisión o eliminación.</p>
      </Section>

      <Section title="11. Enlaces externos">
        <p>El sitio puede contener enlaces a mapas, redes sociales, servicios de mensajería, sitios de proveedores, plataformas de financiamiento u otros recursos de terceros. Amy Blandón no controla sus políticas de privacidad, disponibilidad, contenido ni prácticas de seguridad. El acceso a esos recursos se realiza bajo responsabilidad del usuario y conforme a los términos del tercero correspondiente.</p>
      </Section>

      <Section title="12. Cambios a esta política">
        <p>Esta Política de privacidad puede actualizarse para reflejar cambios operativos, tecnológicos, comerciales o legales. La versión vigente será la publicada en esta página con su fecha de actualización. El uso continuado del sitio después de una modificación implica que el usuario puede consultar la nueva versión antes de seguir utilizando las funcionalidades disponibles.</p>
      </Section>

      <Section title="13. Legislación aplicable">
        <p>Esta política se interpreta conforme a la legislación aplicable en Nicaragua, sin perjuicio de normas imperativas que pudieran resultar aplicables por la ubicación del usuario o por la naturaleza específica de un tratamiento.</p>
      </Section>
    </LegalLayout>
  );
}

export function TermsOfUse() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Condiciones de uso"
      intro="Estas condiciones regulan el acceso y uso de amyblandon.com, incluyendo información inmobiliaria, formularios, fichas de propiedades, mapas, enlaces y demás recursos publicados."
    >
      <Section title="1. Aceptación y finalidad del sitio">
        <p>Al utilizar amyblandon.com, el usuario acepta estas Condiciones de uso. El sitio tiene fines informativos, promocionales y de contacto profesional. La información publicada facilita el acercamiento entre personas interesadas y la asesora, pero por sí sola no sustituye contratos, escrituras, certificaciones, estudios técnicos, asesoría legal, fiscal, financiera ni verificaciones formales.</p>
      </Section>

      <Section title="2. Información sobre propiedades">
        <p>Se procura mantener títulos, precios, medidas, fotografías, ubicaciones generales, características, estados de disponibilidad y demás información con un nivel razonable de exactitud. No obstante, los datos pueden provenir de propietarios, terceros, documentos suministrados o actualizaciones comerciales y pueden cambiar sin previo aviso.</p>
        <p>Antes de tomar una decisión, entregar dinero, firmar una reserva o celebrar un contrato, el interesado debe confirmar la disponibilidad, precio vigente, dimensiones, titularidad, situación registral, cargas, permisos, servicios, linderos, condiciones físicas y cualquier otro aspecto relevante mediante los documentos y profesionales que correspondan.</p>
      </Section>

      <Section title="3. Fotografías, renders, mapas y ubicaciones">
        <p>Las fotografías pueden haber sido optimizadas para mejorar iluminación, contraste, encuadre o presentación sin que ello pretenda alterar materialmente las condiciones del inmueble. Renders, planos, croquis o imágenes conceptuales se consideran ilustrativos salvo que se indique expresamente lo contrario.</p>
        <p>Los mapas, marcadores y referencias geográficas tienen fines de orientación. Una ubicación mostrada en el sitio no constituye certificación catastral, levantamiento topográfico, definición de linderos ni garantía de acceso.</p>
      </Section>

      <Section title="4. Precios, negociación y disponibilidad">
        <p>Los precios publicados pueden modificarse por decisión del propietario, negociación, variaciones comerciales, correcciones o cambios de condición. Una propiedad puede ser reservada, vendida, rentada o retirada antes de que la actualización se refleje en el sitio. La publicación de un inmueble no obliga al propietario ni a Amy Blandón a aceptar una oferta determinada.</p>
      </Section>

      <Section title="5. Financiamiento disponible">
        <p>Cuando una propiedad muestre la etiqueta “Financiamiento disponible”, esta indica únicamente que existe o puede existir una alternativa de financiamiento vinculada a esa oportunidad. La etiqueta no constituye aprobación de crédito, garantía de desembolso, tasa asegurada, promesa de plazo, compromiso de una institución financiera ni declaración de que toda persona calificará.</p>
        <p>Cualquier financiamiento estará sujeto a evaluación, políticas, documentación, capacidad de pago, garantías, condiciones, tasas, gastos y aprobación final de la entidad o persona que lo otorgue. El interesado deberá revisar directamente las condiciones definitivas antes de asumir una obligación.</p>
      </Section>

      <Section title="6. Formularios, consultas y comunicaciones">
        <p>Enviar un formulario, mensaje de WhatsApp, correo electrónico o solicitud desde el sitio no constituye reserva, oferta vinculante, contrato de corretaje, promesa de venta, aceptación de precio ni obligación de cerrar una transacción. Los acuerdos relevantes deberán formalizarse por los medios apropiados y con las partes autorizadas.</p>
      </Section>

      <Section title="7. Decisiones del usuario y debida diligencia">
        <p>El usuario es responsable de evaluar si una propiedad, inversión, renta o modalidad de financiamiento se ajusta a sus necesidades. Se recomienda realizar la debida diligencia correspondiente y, cuando sea necesario, consultar abogados, notarios, ingenieros, valuadores, contadores, instituciones financieras u otros profesionales competentes e independientes.</p>
      </Section>

      <Section title="8. Servicios y contenido de terceros">
        <p>El sitio puede enlazar o integrar servicios de mapas, mensajería, redes sociales, alojamiento, autenticación, financiamiento u otras plataformas externas. La disponibilidad, funcionamiento, contenido, seguridad y condiciones de esos servicios dependen de sus respectivos proveedores. Amy Blandón no responde por interrupciones o decisiones tomadas exclusivamente por dichos terceros.</p>
      </Section>

      <Section title="9. Propiedad intelectual">
        <p>Salvo que se indique otra titularidad, la estructura, selección de contenidos, textos, identidad visual, fotografías propias, elementos gráficos y demás materiales originales del sitio están protegidos por los derechos que correspondan. No se autoriza su reproducción comercial, extracción sistemática, redistribución o utilización engañosa sin autorización previa, excepto los usos permitidos por la ley.</p>
      </Section>

      <Section title="10. Uso permitido">
        <p>El usuario se compromete a utilizar el sitio de forma lícita y a no intentar vulnerar su seguridad, interferir con su funcionamiento, introducir código malicioso, automatizar extracción abusiva de información, suplantar identidades, enviar datos falsos con fines perjudiciales, usar formularios para spam o emplear el contenido para actividades fraudulentas.</p>
      </Section>

      <Section title="11. Disponibilidad del sitio">
        <p>No se garantiza que el sitio esté disponible de forma ininterrumpida o libre de errores. Puede suspenderse temporalmente por mantenimiento, actualizaciones, fallos de proveedores, seguridad, fuerza mayor u otras circunstancias técnicas. Se procurará restaurar el servicio razonablemente cuando sea posible.</p>
      </Section>

      <Section title="12. Limitación de responsabilidad">
        <p>En la medida permitida por la legislación aplicable, Amy Blandón no será responsable por decisiones tomadas exclusivamente a partir de información no verificada del sitio, pérdidas derivadas de servicios de terceros, indisponibilidad temporal, uso indebido de la plataforma o información alterada por causas fuera de su control. Esta disposición no limita responsabilidades que legalmente no puedan excluirse.</p>
      </Section>

      <Section title="13. Modificaciones">
        <p>Estas condiciones pueden modificarse para reflejar cambios en el sitio, sus servicios, riesgos identificados o normativa aplicable. La versión vigente será la publicada en esta página con la fecha correspondiente.</p>
      </Section>

      <Section title="14. Legislación y jurisdicción">
        <p>Estas Condiciones de uso se interpretan conforme a la legislación aplicable en Nicaragua. Cualquier diferencia deberá procurarse resolver primero mediante comunicación de buena fe y, cuando no sea posible, por las vías que correspondan conforme a la normativa aplicable y a la naturaleza de la relación entre las partes.</p>
      </Section>
    </LegalLayout>
  );
}
