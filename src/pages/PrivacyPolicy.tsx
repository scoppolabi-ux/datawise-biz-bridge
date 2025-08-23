import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, FileText, Clock, Users, Lock, Globe } from 'lucide-react';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('privacy-policy');

  const handleNavigate = (section: string) => {
    if (section === 'home') {
      window.location.href = '/';
    } else {
      window.location.href = `/#${section}`;
    }
  };

  useEffect(() => {
    document.title = 'Privacy Policy - DataWisePartners';
  }, []);

  const dataTypes = [
    {
      icon: Globe,
      title: "Dati di Navigazione",
      description: "Informazioni tecniche raccolte automaticamente",
      examples: ["Indirizzo IP", "Tipo di browser", "Log di accesso", "Dati statistici aggregati"]
    },
    {
      icon: Users,
      title: "Dati Volontari",
      description: "Informazioni fornite tramite i nostri form",
      examples: ["Nome e cognome", "Email", "Telefono", "Azienda di appartenenza"]
    },
    {
      icon: Lock,
      title: "Cookie e Preferenze",
      description: "Dati sulle preferenze di navigazione",
      examples: ["Impostazioni cookie", "Preferenze lingua", "Cronologia navigazione"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header onNavigate={handleNavigate} activeSection={activeSection} />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-hero text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-12 h-12 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              La tua privacy è fondamentale. Scopri come proteggiamo e utilizziamo i tuoi dati personali in conformità al GDPR
            </p>
            <div className="flex items-center justify-center mt-6 text-sm opacity-80">
              <Clock className="w-4 h-4 mr-2" />
              <span>Ultimo aggiornamento: Agosto 2025</span>
            </div>
          </div>
        </section>

        {/* Data Types */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              Tipologie di Dati Raccolti
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {dataTypes.map((type, index) => (
                <Card key={index} className="border-0 shadow-card hover:shadow-elegant transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <type.icon className="w-8 h-8 text-brand-red" />
                    </div>
                    <CardTitle className="text-xl text-foreground">
                      {type.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 text-center">
                      {type.description}
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-foreground">Esempi:</h4>
                      <ul className="space-y-1">
                        {type.examples.map((example, idx) => (
                          <li key={idx} className="flex items-center text-sm text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-brand-red mr-2 flex-shrink-0"></div>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Italian Privacy Policy */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-center mb-6 text-foreground">Privacy Policy - Italiano</h2>
            </div>

            <div className="space-y-8">
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-foreground">
                    <FileText className="w-6 h-6 mr-3 text-brand-red" />
                    Informazioni Generali
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    DataWisePartners ("noi", "la Società", "DWP") tutela la privacy dei visitatori del sito web www.datawisepartners.it e si impegna a proteggere i dati personali in conformità al Regolamento (UE) 2016/679 (GDPR) e alla normativa applicabile.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">1. Titolare del trattamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground leading-relaxed">
                    <p className="mb-2">Il titolare del trattamento è:</p>
                    <p className="mb-1"><strong>DataWisePartners S.R.L.</strong></p>
                    <p className="mb-1">Numero di registrazione: J23/2136/2025</p>
                    <p className="mb-1">Codice fiscale (CIF/VAT): RO51133532</p>
                    <p className="mb-1">Sede legale: Str. Biruintei, Nr. 35H, Bl. 4, Et. 1, Ap. 104, Camera 2, Popesti-Leordeni, Judet Ilfov, Romania</p>
                    <p className="mb-1">Email: info@datawisepartners.it</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">2. Tipologie di dati raccolti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground leading-relaxed">
                    <p className="mb-4">Il sito raccoglie diverse tipologie di dati:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span><strong>Dati di navigazione:</strong> indirizzo IP, log di accesso, tipo di browser e dispositivo, dati statistici aggregati.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span><strong>Dati forniti volontariamente:</strong> nome, cognome, email, telefono, azienda e altre informazioni inviate tramite form di contatto o registrazioni a eventi/newsletter.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span><strong>Cookie e tecnologie simili:</strong> informazioni sulle preferenze di navigazione (vedi sezione "Cookie Policy").</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">3. Finalità del trattamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground leading-relaxed">
                    <p className="mb-4">I dati personali sono trattati per le seguenti finalità:</p>
                    <ol className="space-y-2 list-decimal list-inside">
                      <li>Gestione delle richieste inviate tramite form di contatto.</li>
                      <li>Iscrizione e gestione delle newsletter, eventi e comunicazioni commerciali.</li>
                      <li>Miglioramento del sito web e analisi statistiche (in forma aggregata e anonima, ove possibile).</li>
                      <li>Adempimento a obblighi di legge e regolamenti.</li>
                      <li>Tutela dei diritti del Titolare in caso di controversie o attività illecite.</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">4. Base giuridica del trattamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground leading-relaxed">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span>Consenso dell'utente (per newsletter, marketing, cookie non tecnici).</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span>Esecuzione di misure precontrattuali o contrattuali (richieste di informazioni, servizi).</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span>Obblighi legali.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span>Legittimo interesse del Titolare (es. sicurezza del sito e prevenzione abusi).</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">5. Modalità del trattamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Il trattamento avviene con strumenti informatici e telematici, adottando misure tecniche e organizzative adeguate per proteggere i dati da accessi non autorizzati, perdita o uso illecito.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">6. Conservazione dei dati</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground leading-relaxed">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span><strong>Dati di contatto:</strong> conservati per il tempo necessario a rispondere alle richieste.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span><strong>Dati per marketing:</strong> conservati fino a revoca del consenso (max 24 mesi).</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span><strong>Dati tecnici/log:</strong> conservati fino a 12 mesi.</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">7. Comunicazione dei dati</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground leading-relaxed">
                    <p className="mb-4">I dati personali possono essere comunicati a:</p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span>Fornitori di servizi IT, hosting, manutenzione del sito.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span>Consulenti o partner di DataWisePartners per attività strettamente connesse ai servizi.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span>Autorità competenti, se richiesto dalla legge.</span>
                      </li>
                    </ul>
                    <p>Non è prevista diffusione dei dati a soggetti indeterminati.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">8. Trasferimento extra-UE</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Il trattamento avviene principalmente all'interno dell'UE. Se i dati vengono trasferiti verso Paesi extra-UE, ciò avverrà solo in presenza di garanzie adeguate (es. Clausole Contrattuali Standard approvate dalla Commissione Europea).
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">9. Diritti dell'interessato</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground leading-relaxed">
                    <p className="mb-4">L'utente ha diritto di:</p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span>accedere ai propri dati personali;</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span>chiederne la rettifica o cancellazione;</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span>limitare o opporsi al trattamento;</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span>revocare il consenso prestato in qualsiasi momento;</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span>chiedere la portabilità dei dati.</span>
                      </li>
                    </ul>
                    <p className="mb-2">Per esercitare i propri diritti: <strong>info@datawisepartners.it</strong></p>
                    <p>L'utente può inoltre proporre reclamo al Garante per la Protezione dei Dati Personali (www.garanteprivacy.it).</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">10. Cookie Policy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Il sito utilizza cookie tecnici e, previo consenso, cookie analitici/di profilazione di terze parti. La gestione dettagliata dei cookie è descritta in un documento separato ("Cookie Policy").
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">11. Aggiornamenti</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    La presente Privacy Policy può essere soggetta a modifiche. Gli utenti sono invitati a consultarla periodicamente.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* English Privacy Policy */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-center mb-6 text-foreground">Privacy Policy - English Version</h2>
            </div>

            <div className="space-y-8">
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-foreground">
                    <FileText className="w-6 h-6 mr-3 text-brand-red" />
                    General Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    DataWisePartners ("we", "the Company", "DWP") values the privacy of visitors to its website www.datawisepartners.it and is committed to protecting personal data in compliance with Regulation (EU) 2016/679 (GDPR) and applicable laws.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">1. Data Controller</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground leading-relaxed">
                    <p className="mb-2">The Data Controller is:</p>
                    <p className="mb-1"><strong>DataWisePartners S.R.L.</strong></p>
                    <p className="mb-1">Trade Register number: J23/2136/2025</p>
                    <p className="mb-1">Tax code (CIF/VAT): RO51133532</p>
                    <p className="mb-1">Registered office: Str. Biruintei, Nr. 35H, Bl. 4, Et. 1, Ap. 104, Room 2, Popesti-Leordeni, Ilfov County, Romania</p>
                    <p className="mb-1">Email: info@datawisepartners.it</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">2. Types of Data Collected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground leading-relaxed">
                    <p className="mb-4">The website may collect the following types of data:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span><strong>Browsing data:</strong> IP address, access logs, browser and device type, aggregated statistical data.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span><strong>Data voluntarily provided:</strong> name, surname, email, phone, company, and any information provided through contact forms, newsletter subscriptions, or event registrations.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span><strong>Cookies and similar technologies:</strong> information about browsing preferences (see "Cookie Policy").</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">3. Purposes of Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground leading-relaxed">
                    <p className="mb-4">Personal data is processed for the following purposes:</p>
                    <ol className="space-y-2 list-decimal list-inside">
                      <li>Handling requests submitted via contact forms.</li>
                      <li>Managing newsletter subscriptions, events, and commercial communications.</li>
                      <li>Improving website functionality and statistical analysis (in aggregated and anonymized form where possible).</li>
                      <li>Compliance with legal obligations.</li>
                      <li>Protection of the Data Controller's rights in case of disputes or unlawful activities.</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">4. Legal Basis for Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground leading-relaxed">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span>User consent (e.g. newsletter, marketing, non-technical cookies).</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span>Execution of pre-contractual or contractual measures (information requests, services).</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span>Legal obligations.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span>Legitimate interest of the Controller (e.g. website security, fraud prevention).</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">5. Processing Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Data is processed using electronic and telematic tools, with adequate technical and organizational measures in place to prevent unauthorized access, loss, or unlawful use.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">6. Data Retention</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground leading-relaxed">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span><strong>Contact data:</strong> retained for as long as necessary to respond to requests.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span><strong>Marketing data:</strong> retained until consent is withdrawn (maximum 24 months).</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span><strong>Technical/log data:</strong> retained up to 12 months.</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">7. Data Disclosure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground leading-relaxed">
                    <p className="mb-4">Personal data may be disclosed to:</p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span>IT service providers, hosting, and site maintenance providers.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span>Consultants or partners of DataWisePartners strictly related to the provided services.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span>Competent authorities, where required by law.</span>
                      </li>
                    </ul>
                    <p>Data will not be disseminated to unspecified recipients.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">8. Data Transfer Outside the EU</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Processing is primarily carried out within the EU. If data is transferred outside the EU, it will only occur with adequate safeguards (e.g. Standard Contractual Clauses approved by the European Commission).
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">9. User Rights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground leading-relaxed">
                    <p className="mb-4">Users have the right to:</p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span>access their personal data;</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span>request rectification or deletion;</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span>restrict or object to processing;</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span>withdraw consent at any time;</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-red mr-3 mt-2 flex-shrink-0"></div>
                        <span>request data portability.</span>
                      </li>
                    </ul>
                    <p className="mb-2">To exercise these rights: <strong>info@datawisepartners.it</strong></p>
                    <p>Users may also lodge a complaint with the Italian Data Protection Authority (Garante per la Protezione dei Dati Personali) – www.garanteprivacy.it.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">10. Cookie Policy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    The website uses technical cookies and, with user consent, third-party analytical/profiling cookies. Detailed information is provided in a separate document ("Cookie Policy").
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">11. Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    This Privacy Policy may be updated at any time. Users are encouraged to review it periodically.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-gradient-hero text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Hai Domande sulla Privacy?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Il nostro team è a disposizione per chiarire qualsiasi dubbio riguardo al trattamento dei tuoi dati personali e alla tutela della privacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => handleNavigate('contact')}
                className="bg-white text-brand-red px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Contattaci
              </button>
              <button 
                onClick={() => window.location.href = '/cookie-policy'}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300"
              >
                Leggi la Cookie Policy
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default PrivacyPolicy;