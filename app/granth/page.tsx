import type { Metadata } from 'next';
import { SacredStrip, SiteNav, SiteFooter, Crumbs, JoinBand, RelatedLinks, Ld, articleLd, crumbLd, faqLd } from '../components/SiteChrome';

export const metadata: Metadata = {
  title: 'सनातन धर्म के ग्रंथ — वेद, उपनिषद्, पुराण, रामायण, महाभारत एवं गीता | सनातन परिवार',
  description: 'सनातन धर्म के सभी प्रमुख ग्रंथों का परिचय — चार वेद, 108 उपनिषद्, 18 पुराण, रामायण, महाभारत, भगवद् गीता, षड्दर्शन, स्मृति एवं सूत्र ग्रंथ। श्रुति और स्मृति का अंतर सरल हिंदी में।',
  keywords: ['सनातन धर्म के ग्रंथ', 'चार वेद', 'उपनिषद', '18 पुराण', 'रामायण महाभारत', 'भगवद गीता', 'श्रुति स्मृति', 'षड्दर्शन', 'वेदांग', 'hindu scriptures', 'four vedas', 'upanishads', 'puranas list', 'वेद कितने हैं', 'गीता में कितने श्लोक हैं'],
  alternates: { canonical: '/granth' },
  openGraph: { title: 'सनातन धर्म के ग्रंथ — वेद, उपनिषद्, पुराण एवं गीता', description: 'सनातन के सभी प्रमुख ग्रंथों का सरल परिचय।', url: 'https://sanatanparivar.in/granth', type: 'article' },
};

const CRUMBS = [{ href: '/', label: 'मुख्य पृष्ठ' }, { href: '/granth', label: 'ग्रंथ' }];

const FAQ = [
  { q: 'वेद कितने हैं और उनके नाम क्या हैं?', a: 'वेद चार हैं — ऋग्वेद, यजुर्वेद, सामवेद और अथर्ववेद। ऋग्वेद स्तुति और ज्ञान का, यजुर्वेद यज्ञ और कर्म का, सामवेद संगीत और उपासना का, तथा अथर्ववेद लोकजीवन, औषधि और व्यावहारिक विज्ञान का वेद है।' },
  { q: 'श्रुति और स्मृति में क्या अंतर है?', a: 'श्रुति वह है जो ऋषियों ने समाधि अवस्था में "सुनी" — अर्थात् वेद, ब्राह्मण, आरण्यक और उपनिषद्। इन्हें अपौरुषेय अर्थात् किसी मनुष्य द्वारा रचित नहीं माना जाता। स्मृति वह है जो स्मरण के आधार पर मनुष्यों द्वारा रची गई — जैसे रामायण, महाभारत, पुराण, मनुस्मृति और धर्मशास्त्र। मतभेद की स्थिति में श्रुति को अधिक प्रामाणिक माना जाता है।' },
  { q: 'भगवद् गीता में कितने श्लोक हैं?', a: 'भगवद् गीता में 18 अध्याय और लगभग 700 श्लोक हैं। यह महाभारत के भीष्म पर्व का अंग है, जिसमें कुरुक्षेत्र के युद्धक्षेत्र में श्रीकृष्ण ने अर्जुन को उपदेश दिया।' },
  { q: 'उपनिषद् कितने हैं?', a: 'मुक्तिका उपनिषद् में 108 उपनिषदों की सूची दी गई है। इनमें से दस से तेरह उपनिषदों को मुख्य या प्रधान माना जाता है — ईश, केन, कठ, प्रश्न, मुण्डक, माण्डूक्य, तैत्तिरीय, ऐतरेय, छान्दोग्य और बृहदारण्यक — जिन पर आदि शंकराचार्य ने भाष्य लिखे।' },
  { q: 'सबसे बड़ा महाकाव्य कौन सा है?', a: 'महाभारत विश्व का सबसे विशाल महाकाव्य है, जिसमें लगभग एक लाख श्लोक और 18 पर्व हैं। यह रामायण से लगभग चार गुना बड़ा है और इलियड तथा ओडिसी को मिलाकर भी उससे कई गुना बड़ा माना जाता है।' },
];

export default function GranthPage() {
  return (
    <>
      <Ld data={[
        articleLd({ slug: '/granth', headline: 'सनातन धर्म के ग्रंथ — वेद, उपनिषद्, पुराण एवं गीता', description: 'सनातन धर्म के प्रमुख ग्रंथों का विस्तृत परिचय।', section: 'शास्त्र', modified: '2026-08-29' }),
        crumbLd(CRUMBS), faqLd(FAQ),
      ]} />
      <SacredStrip />
      <SiteNav active="/granth" />
      <main className="art-wrap">
        <Crumbs items={CRUMBS} />
        <header className="art-head">
          <div className="art-head-om">ॐ</div>
          <h1 className="art-h1">सनातन धर्म के ग्रंथ</h1>
          <p className="art-lead">
            सनातन धर्म किसी एक पुस्तक पर आधारित नहीं है। यह ग्रंथों का एक विशाल पुस्तकालय है —
            जिसमें स्तुति भी है, दर्शन भी, विज्ञान भी और कथा भी। यहाँ उन सबका क्रमबद्ध परिचय है।
          </p>
        </header>

        <nav className="toc" aria-label="विषय-सूची">
          <div className="toc-title">इस पृष्ठ में</div>
          <ol>
            <li><a href="#shruti-smriti">श्रुति और स्मृति — मूल विभाजन</a></li>
            <li><a href="#ved">चार वेद</a></li>
            <li><a href="#upanishad">उपनिषद्</a></li>
            <li><a href="#itihas">रामायण एवं महाभारत</a></li>
            <li><a href="#gita">भगवद् गीता</a></li>
            <li><a href="#puran">अठारह पुराण</a></li>
            <li><a href="#darshan">षड्दर्शन</a></li>
            <li><a href="#prashn">अक्सर पूछे जाने वाले प्रश्न</a></li>
          </ol>
        </nav>

        <section className="art-sec" id="shruti-smriti">
          <h2 className="art-h2">श्रुति और स्मृति — मूल विभाजन</h2>
          <p className="art-p">
            सनातन ग्रंथों का सबसे मूल विभाजन दो भागों में है। <strong>श्रुति</strong> — जो सुनी गई, अर्थात्
            ऋषियों ने समाधि की अवस्था में जिसका साक्षात्कार किया। इसे <em>अपौरुषेय</em> कहा जाता है — किसी
            मनुष्य द्वारा रचित नहीं। <strong>स्मृति</strong> — जो स्मरण के आधार पर मनुष्यों द्वारा रची गई।
          </p>
          <div className="art-grid two">
            <article className="art-card">
              <h3>श्रुति</h3>
              <p>चार वेद और उनके चार भाग — संहिता, ब्राह्मण, आरण्यक तथा उपनिषद्। ये सर्वोच्च प्रमाण माने जाते हैं।</p>
            </article>
            <article className="art-card">
              <h3>स्मृति</h3>
              <p>रामायण, महाभारत, पुराण, धर्मशास्त्र, सूत्र-ग्रंथ, आगम एवं तंत्र। ये देश-काल के अनुसार व्याख्या देते हैं।</p>
            </article>
          </div>
          <div className="note">
            <div className="note-label">नियम</div>
            <p>यदि श्रुति और स्मृति में विरोध हो, तो श्रुति को अधिक प्रामाणिक माना जाता है — यह परम्परा का स्वीकृत सिद्धांत है।</p>
          </div>
        </section>

        <section className="art-sec" id="ved">
          <h2 className="art-h2">चार वेद</h2>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>वेद</th><th>विषय</th><th>विशेष</th></tr></thead>
              <tbody>
                <tr><td><strong>ऋग्वेद</strong></td><td>स्तुति एवं ज्ञान</td><td>10 मंडल, 1028 सूक्त, लगभग 10,600 मंत्र। सबसे प्राचीन।</td></tr>
                <tr><td><strong>यजुर्वेद</strong></td><td>यज्ञ एवं कर्म</td><td>शुक्ल एवं कृष्ण — दो शाखाएँ। यज्ञ की विधि।</td></tr>
                <tr><td><strong>सामवेद</strong></td><td>संगीत एवं उपासना</td><td>भारतीय संगीत का मूल स्रोत। ऋचाओं का गान।</td></tr>
                <tr><td><strong>अथर्ववेद</strong></td><td>लोकजीवन एवं विज्ञान</td><td>औषधि, कृषि, राजनीति एवं दैनिक जीवन।</td></tr>
              </tbody>
            </table>
          </div>
          <h3 className="art-h3">प्रत्येक वेद के चार भाग</h3>
          <ul className="art-ul">
            <li><strong>संहिता</strong> — मूल मंत्र</li>
            <li><strong>ब्राह्मण</strong> — यज्ञ की विधि एवं व्याख्या</li>
            <li><strong>आरण्यक</strong> — वन में किया जाने वाला चिंतन</li>
            <li><strong>उपनिषद्</strong> — दार्शनिक सार, जिसे वेदान्त कहा जाता है</li>
          </ul>
          <p className="art-p">
            वेद के छह अंग (वेदांग) और चार उपवेद भी हैं, जिनका विस्तृत विवरण <a href="/gurukul">गुरुकुल पृष्ठ</a> पर दिया गया है।
          </p>
        </section>

        <section className="art-sec" id="upanishad">
          <h2 className="art-h2">उपनिषद्</h2>
          <p className="art-p">
            &ldquo;उपनिषद्&rdquo; का अर्थ है — पास बैठना, अर्थात् गुरु के समीप बैठकर प्राप्त किया गया रहस्य-ज्ञान।
            मुक्तिका उपनिषद् में <strong>108 उपनिषदों</strong> की सूची है, जिनमें दस से तेरह मुख्य माने जाते हैं।
          </p>
          <div className="art-grid two">
            <article className="art-card"><h3>महावाक्य</h3><p><em>अहं ब्रह्मास्मि</em> (मैं ब्रह्म हूँ), <em>तत्त्वमसि</em> (वह तू है), <em>प्रज्ञानं ब्रह्म</em> (प्रज्ञा ही ब्रह्म है), <em>अयमात्मा ब्रह्म</em> (यह आत्मा ब्रह्म है)।</p></article>
            <article className="art-card"><h3>मुख्य उपनिषद्</h3><p>ईश, केन, कठ, प्रश्न, मुण्डक, माण्डूक्य, तैत्तिरीय, ऐतरेय, छान्दोग्य एवं बृहदारण्यक — इन पर आदि शंकराचार्य ने भाष्य लिखे।</p></article>
          </div>
          <div className="shl-box">
            <div className="sk">{'असतो मा सद्गमय।\nतमसो मा ज्योतिर्गमय।\nमृत्योर्मामृतं गमय॥'}</div>
            <div className="mn">असत्य से सत्य की ओर, अंधकार से प्रकाश की ओर, मृत्यु से अमरत्व की ओर ले चलो।</div>
            <div className="sr">— बृहदारण्यक उपनिषद् 1.3.28</div>
          </div>
        </section>

        <section className="art-sec" id="itihas">
          <h2 className="art-h2">रामायण एवं महाभारत</h2>
          <p className="art-p">इन्हें <strong>इतिहास</strong> ग्रंथ कहा जाता है — अर्थात् &ldquo;ऐसा ही हुआ था&rdquo;।</p>
          <div className="art-grid two">
            <article className="art-card">
              <h3>वाल्मीकि रामायण</h3>
              <p>महर्षि वाल्मीकि रचित, लगभग 24,000 श्लोक, 7 कांड — बालकांड, अयोध्याकांड, अरण्यकांड, किष्किंधाकांड, सुंदरकांड, युद्धकांड और उत्तरकांड। इसे आदिकाव्य कहा जाता है। तुलसीदास ने अवधी में रामचरितमानस रचकर इसे जन-जन तक पहुँचाया।</p>
            </article>
            <article className="art-card">
              <h3>महाभारत</h3>
              <p>महर्षि वेदव्यास रचित, लगभग एक लाख श्लोक, 18 पर्व। विश्व का सबसे विशाल महाकाव्य। इसी में भगवद् गीता, विष्णु सहस्रनाम और अनेक उपकथाएँ सम्मिलित हैं। इसे &ldquo;पंचम वेद&rdquo; भी कहा जाता है।</p>
            </article>
          </div>
        </section>

        <section className="art-sec" id="gita">
          <h2 className="art-h2">भगवद् गीता</h2>
          <p className="art-p">
            महाभारत के <strong>भीष्म पर्व</strong> का अंग — <strong>18 अध्याय</strong> और लगभग <strong>700 श्लोक</strong>।
            कुरुक्षेत्र के युद्धक्षेत्र में विषाद में डूबे अर्जुन को श्रीकृष्ण का उपदेश। गीता तीन मार्ग बताती है —
            <strong> कर्मयोग</strong> (निष्काम कर्म), <strong>भक्तियोग</strong> (प्रेम एवं समर्पण) और
            <strong> ज्ञानयोग</strong> (विवेक एवं आत्मज्ञान)।
          </p>
          <div className="shl-box">
            <div className="sk">{'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥'}</div>
            <div className="mn">तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में नहीं। न फल के हेतु बनो, न अकर्म में आसक्ति रखो।</div>
            <div className="sr">— भगवद् गीता 2.47</div>
          </div>
          <p className="art-p">प्रतिदिन एक नया श्लोक अर्थ सहित पढ़ने के लिए <a href="/shloka">दैनिक श्लोक पृष्ठ</a> देखें।</p>
        </section>

        <section className="art-sec" id="puran">
          <h2 className="art-h2">अठारह महापुराण</h2>
          <p className="art-p">
            पुराण सृष्टि, वंशावली, कथा और उपासना के ग्रंथ हैं जिन्होंने दर्शन को सरल कथाओं के माध्यम से
            जन-जन तक पहुँचाया। परम्परा में <strong>18 महापुराण</strong> और 18 उपपुराण माने जाते हैं।
          </p>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>वर्ग</th><th>पुराण</th></tr></thead>
              <tbody>
                <tr><td><strong>वैष्णव</strong></td><td>विष्णु, भागवत, नारद, गरुड़, पद्म, वराह</td></tr>
                <tr><td><strong>शैव</strong></td><td>शिव, लिंग, स्कंद, अग्नि, मत्स्य, कूर्म</td></tr>
                <tr><td><strong>ब्राह्म</strong></td><td>ब्रह्म, ब्रह्मांड, ब्रह्मवैवर्त, मार्कण्डेय, भविष्य, वामन</td></tr>
              </tbody>
            </table>
          </div>
          <p className="art-p">
            इनमें <strong>श्रीमद्भागवत पुराण</strong> सर्वाधिक लोकप्रिय है, जिसका दशम स्कंध श्रीकृष्ण की
            लीलाओं को समर्पित है और जिसने पूरे भक्ति आंदोलन को प्रेरणा दी।
          </p>
        </section>

        <section className="art-sec" id="darshan">
          <h2 className="art-h2">षड्दर्शन — छह दार्शनिक पद्धतियाँ</h2>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>दर्शन</th><th>प्रवर्तक</th><th>मूल विषय</th></tr></thead>
              <tbody>
                <tr><td><strong>न्याय</strong></td><td>गौतम</td><td>तर्कशास्त्र एवं प्रमाण-विज्ञान</td></tr>
                <tr><td><strong>वैशेषिक</strong></td><td>कणाद</td><td>पदार्थ एवं परमाणु सिद्धांत</td></tr>
                <tr><td><strong>सांख्य</strong></td><td>कपिल</td><td>प्रकृति एवं पुरुष का द्वैत</td></tr>
                <tr><td><strong>योग</strong></td><td>पतंजलि</td><td>चित्तवृत्ति निरोध, अष्टांग योग</td></tr>
                <tr><td><strong>मीमांसा</strong></td><td>जैमिनि</td><td>वेद-वाक्यों की व्याख्या एवं कर्म</td></tr>
                <tr><td><strong>वेदान्त</strong></td><td>बादरायण</td><td>ब्रह्म एवं आत्मा का स्वरूप</td></tr>
              </tbody>
            </table>
          </div>
          <p className="art-p">
            वेदान्त की तीन प्रमुख शाखाएँ हैं — आदि शंकराचार्य का <strong>अद्वैत</strong>, रामानुजाचार्य का
            <strong> विशिष्टाद्वैत</strong> और माध्वाचार्य का <strong>द्वैत</strong>।
          </p>
        </section>

        <JoinBand />

        <section className="art-sec art-faq" id="prashn">
          <h2 className="art-h2">अक्सर पूछे जाने वाले प्रश्न</h2>
          {FAQ.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
        </section>

        <RelatedLinks exclude="/granth" />
      </main>
      <SiteFooter />
    </>
  );
}
