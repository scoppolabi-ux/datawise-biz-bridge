import { useState } from 'react';
import { ArrowLeft, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'it' | 'en'>('it');

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna al sito
          </Button>
          
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <Button
              variant={language === 'it' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('it')}
            >
              IT
            </Button>
            <Button
              variant={language === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('en')}
            >
              EN
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {language === 'it' ? (
            <div className="prose prose-lg max-w-none">
              <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
              <p className="text-center text-muted-foreground mb-8">Ultimo aggiornamento: Agosto 2025</p>
              
              <div className="bg-card rounded-lg p-6 mb-8">
                <p className="text-lg">
                  DataWisePartners ("noi", "la Società", "DWP") tutela la privacy dei visitatori del sito web{' '}
                  <strong>www.datawisepartners.it</strong> e si impegna a proteggere i dati personali in conformità al 
                  Regolamento (UE) 2016/679 (GDPR) e alla normativa applicabile.
                </p>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Titolare del trattamento</h2>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p><strong>DataWisePartners S.R.L.</strong></p>
                  <p>Numero di registrazione: J23/2136/2025</p>
                  <p>Codice fiscale (CIF/VAT): RO51133532</p>
                  <p>Sede legale: Str. Biruintei, Nr. 35H, Bl. 4, Et. 1, Ap. 104, Camera 2,<br />
                     Popesti-Leordeni, Judet Ilfov, Romania</p>
                  <p>Email: <strong>info@datawisepartners.it</strong></p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Tipologie di dati raccolti</h2>
                <p className="mb-4">Il sito raccoglie diverse tipologie di dati:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Dati di navigazione:</strong> indirizzo IP, log di accesso, tipo di browser e dispositivo, dati statistici aggregati.</li>
                  <li><strong>Dati forniti volontariamente:</strong> nome, cognome, email, telefono, azienda e altre informazioni inviate tramite form di contatto o registrazioni a eventi/newsletter.</li>
                  <li><strong>Cookie e tecnologie simili:</strong> informazioni sulle preferenze di navigazione (vedi sezione "Cookie Policy").</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Finalità del trattamento</h2>
                <p className="mb-4">I dati personali sono trattati per le seguenti finalità:</p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Gestione delle richieste inviate tramite form di contatto.</li>
                  <li>Iscrizione e gestione delle newsletter, eventi e comunicazioni commerciali.</li>
                  <li>Miglioramento del sito web e analisi statistiche (in forma aggregata e anonima, ove possibile).</li>
                  <li>Adempimento a obblighi di legge e regolamenti.</li>
                  <li>Tutela dei diritti del Titolare in caso di controversie o attività illecite.</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Base giuridica del trattamento</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Consenso dell'utente</strong> (per newsletter, marketing, cookie non tecnici).</li>
                  <li><strong>Esecuzione di misure precontrattuali o contrattuali</strong> (richieste di informazioni, servizi).</li>
                  <li><strong>Obblighi legali.</strong></li>
                  <li><strong>Legittimo interesse del Titolare</strong> (es. sicurezza del sito e prevenzione abusi).</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Modalità del trattamento</h2>
                <p>Il trattamento avviene con strumenti informatici e telematici, adottando misure tecniche e organizzative adeguate per proteggere i dati da accessi non autorizzati, perdita o uso illecito.</p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Conservazione dei dati</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Dati di contatto:</strong> conservati per il tempo necessario a rispondere alle richieste.</li>
                  <li><strong>Dati per marketing:</strong> conservati fino a revoca del consenso (max 24 mesi).</li>
                  <li><strong>Dati tecnici/log:</strong> conservati fino a 12 mesi.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Comunicazione dei dati</h2>
                <p className="mb-4">I dati personali possono essere comunicati a:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Fornitori di servizi IT, hosting, manutenzione del sito.</li>
                  <li>Consulenti o partner di DataWisePartners per attività strettamente connesse ai servizi.</li>
                  <li>Autorità competenti, se richiesto dalla legge.</li>
                </ul>
                <p className="mt-4"><strong>Non è prevista diffusione dei dati a soggetti indeterminati.</strong></p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. Trasferimento extra-UE</h2>
                <p>Il trattamento avviene principalmente all'interno dell'UE. Se i dati vengono trasferiti verso Paesi extra-UE, ciò avverrà solo in presenza di garanzie adeguate (es. Clausole Contrattuali Standard approvate dalla Commissione Europea).</p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">9. Diritti dell'interessato</h2>
                <p className="mb-4">L'utente ha diritto di:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>accedere ai propri dati personali;</li>
                  <li>chiederne la rettifica o cancellazione;</li>
                  <li>limitare o opporsi al trattamento;</li>
                  <li>revocare il consenso prestato in qualsiasi momento;</li>
                  <li>chiedere la portabilità dei dati.</li>
                </ul>
                <div className="bg-primary/10 rounded-lg p-4 mt-4">
                  <p><strong>Per esercitare i propri diritti:</strong> info@datawisepartners.it</p>
                  <p className="mt-2">L'utente può inoltre proporre reclamo al Garante per la Protezione dei Dati Personali (www.garanteprivacy.it).</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">10. Cookie Policy</h2>
                <p>Il sito utilizza cookie tecnici e, previo consenso, cookie analitici/di profilazione di terze parti. La gestione dettagliata dei cookie è descritta in un documento separato ("Cookie Policy").</p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">11. Aggiornamenti</h2>
                <p>La presente Privacy Policy può essere soggetta a modifiche. Gli utenti sono invitati a consultarla periodicamente.</p>
              </section>
            </div>
          ) : (
            <div className="prose prose-lg max-w-none">
              <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
              <p className="text-center text-muted-foreground mb-8">Last update: August 2025</p>
              
              <div className="bg-card rounded-lg p-6 mb-8">
                <p className="text-lg">
                  DataWisePartners ("we", "the Company", "DWP") values the privacy of visitors to its website{' '}
                  <strong>www.datawisepartners.it</strong> and is committed to protecting personal data in compliance 
                  with Regulation (EU) 2016/679 (GDPR) and applicable laws.
                </p>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Data Controller</h2>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p><strong>DataWisePartners S.R.L.</strong></p>
                  <p>Trade Register number: J23/2136/2025</p>
                  <p>Tax code (CIF/VAT): RO51133532</p>
                  <p>Registered office: Str. Biruintei, Nr. 35H, Bl. 4, Et. 1, Ap. 104, Room 2,<br />
                     Popesti-Leordeni, Ilfov County, Romania</p>
                  <p>Email: <strong>info@datawisepartners.it</strong></p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Types of Data Collected</h2>
                <p className="mb-4">The website may collect the following types of data:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Browsing data:</strong> IP address, access logs, browser and device type, aggregated statistical data.</li>
                  <li><strong>Data voluntarily provided:</strong> name, surname, email, phone, company, and any information provided through contact forms, newsletter subscriptions, or event registrations.</li>
                  <li><strong>Cookies and similar technologies:</strong> information about browsing preferences (see "Cookie Policy").</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Purposes of Processing</h2>
                <p className="mb-4">Personal data is processed for the following purposes:</p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Handling requests submitted via contact forms.</li>
                  <li>Managing newsletter subscriptions, events, and commercial communications.</li>
                  <li>Improving website functionality and statistical analysis (in aggregated and anonymized form where possible).</li>
                  <li>Compliance with legal obligations.</li>
                  <li>Protection of the Data Controller's rights in case of disputes or unlawful activities.</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Legal Basis for Processing</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>User consent</strong> (e.g. newsletter, marketing, non-technical cookies).</li>
                  <li><strong>Execution of pre-contractual or contractual measures</strong> (information requests, services).</li>
                  <li><strong>Legal obligations.</strong></li>
                  <li><strong>Legitimate interest of the Controller</strong> (e.g. website security, fraud prevention).</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Processing Methods</h2>
                <p>Data is processed using electronic and telematic tools, with adequate technical and organizational measures in place to prevent unauthorized access, loss, or unlawful use.</p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Contact data:</strong> retained for as long as necessary to respond to requests.</li>
                  <li><strong>Marketing data:</strong> retained until consent is withdrawn (maximum 24 months).</li>
                  <li><strong>Technical/log data:</strong> retained up to 12 months.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Data Disclosure</h2>
                <p className="mb-4">Personal data may be disclosed to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IT service providers, hosting, and site maintenance providers.</li>
                  <li>Consultants or partners of DataWisePartners strictly related to the provided services.</li>
                  <li>Competent authorities, where required by law.</li>
                </ul>
                <p className="mt-4"><strong>Data will not be disseminated to unspecified recipients.</strong></p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. Data Transfer Outside the EU</h2>
                <p>Processing is primarily carried out within the EU. If data is transferred outside the EU, it will only occur with adequate safeguards (e.g. Standard Contractual Clauses approved by the European Commission).</p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">9. User Rights</h2>
                <p className="mb-4">Users have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>access their personal data;</li>
                  <li>request rectification or deletion;</li>
                  <li>restrict or object to processing;</li>
                  <li>withdraw consent at any time;</li>
                  <li>request data portability.</li>
                </ul>
                <div className="bg-primary/10 rounded-lg p-4 mt-4">
                  <p><strong>To exercise these rights:</strong> info@datawisepartners.it</p>
                  <p className="mt-2">Users may also lodge a complaint with the Italian Data Protection Authority (Garante per la Protezione dei Dati Personali) – www.garanteprivacy.it.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">10. Cookie Policy</h2>
                <p>The website uses technical cookies and, with user consent, third-party analytical/profiling cookies. Detailed information is provided in a separate document ("Cookie Policy").</p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">11. Updates</h2>
                <p>This Privacy Policy may be updated at any time. Users are encouraged to review it periodically.</p>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;