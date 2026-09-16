export interface Question {
  id: string;
  text: string;
  type: 'radio' | 'text' | 'rating';
  options?: string[];
}

export const pwQuestions: Question[] = [
  {
    id: 'pw_q1',
    text: `1. జననీ మిత్ర యాప్‌ను ఎలా ఓపెన్ చేయాలో మీకు తెలుసా?\nDo you know how to open the Janani Mitra app?`,
    type: 'radio',
    options: ['Yes (అవును)', 'No (లేదు)', 'Need help (సహాయం కావాలి)']
  },
  {
    id: 'pw_q2',
    text: `2. ఈ యాప్‌ను మీ ఫోన్‌లో ఎవరు ఇన్‌స్టాల్ చేశారు?\nWho installed this app on your phone?`,
    type: 'radio',
    options: ['ASHA Worker (ఆశా వర్కర్)', 'ANM', 'Family Member (కుటుంబ సభ్యులు)', 'I did it myself (నేనే చేసుకున్నాను)']
  },
  {
    id: 'pw_q3',
    text: `3. యాప్‌లో మీరు తినే ఆహారాన్ని ఎలా నమోదు చేయాలో మీకు అర్థమైందా?\nDo you understand how to log your food in the app?`,
    type: 'radio',
    options: ['Easily understood (సులభంగా అర్థమైంది)', 'Needed some help (కొంత సహాయం అవసరమైంది)', 'Did not understand (అర్థం కాలేదు)']
  },
  {
    id: 'pw_q4',
    text: `4. మీరు ప్రతిరోజూ యాప్‌లో ఆహారాన్ని నమోదు చేస్తున్నారా?\nAre you entering your food in the app every day?`,
    type: 'radio',
    options: ['Every day (ప్రతిరోజూ)', 'Most days (చాలా రోజులు)', 'Sometimes (అప్పుడప్పుడు)', 'Not doing it (చేయడం లేదు)']
  },
  {
    id: 'pw_q5',
    text: `5. "Your Baby" స్క్రీన్‌లో మీ శిశువు పెరుగుదల గురించి చూశారా?\nDid you look at your baby's growth on the "Your Baby" screen?`,
    type: 'radio',
    options: ['Yes (అవును)', 'No (లేదు)', 'Did not notice it (గమనించలేదు)']
  },
  {
    id: 'pw_q6',
    text: `6. యాప్‌లో మీ పేరు మరియు నెలలు సరిగ్గానే ఉన్నాయా?\nAre your name and pregnancy month correct in the app?`,
    type: 'radio',
    options: ['Correct (సరిగ్గా ఉన్నాయి)', 'Incorrect (తప్పుగా ఉన్నాయి)']
  },
  {
    id: 'pw_q7',
    text: `7. ఆహారం రంగు (ఆకుపచ్చ, పసుపు, ఎరుపు) చూసి మీరు మంచి ఆహారం తింటున్నారో లేదో తెలుసుకోగలుగుతున్నారా?\nAre you able to tell if you are eating good food by looking at the food color (Green, Yellow, Red)?`,
    type: 'radio',
    options: ['Yes, very easily (అవును, చాలా సులభంగా)', 'Yes, but a little confusing (అవును, కానీ కొంచెం గందరగోళంగా ఉంది)', "No, I don't understand (లేదు, నాకు అర్థం కాలేదు)"]
  },
  {
    id: 'pw_q8',
    text: `8. మీరు తీసుకున్న IFA (ఐరన్) మాత్రలను యాప్‌లో నమోదు చేస్తున్నారా?\nAre you entering the IFA (Iron) tablets you take in the app?`,
    type: 'radio',
    options: ['Every day (ప్రతిరోజూ)', 'Sometimes (అప్పుడప్పుడు)', 'Not entering (నమోదు చేయడం లేదు)']
  },
  {
    id: 'pw_q9',
    text: `9. యాప్‌లో ఆహారం నమోదు చేయడం వల్ల మీరు మంచి ఆహారం తినడానికి సహాయపడుతోందా?\nIs logging food in the app helping you eat better food?`,
    type: 'radio',
    options: ['Yes, very much (అవును, చాలా)', 'Somewhat (కొంత వరకు)', 'No difference (ఎలాంటి మార్పు లేదు)']
  },
  {
    id: 'pw_q10',
    text: `10. యాప్‌ను ఉపయోగించడంలో మీకు ఎవరి సహాయం అవసరమైంది?\nWho helped you use the app?`,
    type: 'radio',
    options: ['ASHA Worker (ఆశా వర్కర్)', 'Husband/Family (భర్త/కుటుంబ సభ్యులు)', 'No one, I used it myself (ఎవరూ కాదు, నేనే ఉపయోగించాను)', 'I am not able to use it (నేను ఉపయోగించలేకపోతున్నాను)']
  },
  {
    id: 'pw_q11',
    text: `11. ఆహారం నమోదు చేయని రోజుల్లో, దానికి కారణం ఏమిటి?\nOn the days you did not add food, what was the reason?`,
    type: 'radio',
    options: ['Phone was not with me (నా దగ్గర ఫోన్ లేదు)', 'I forgot (మర్చిపోయాను)', 'It felt difficult (కష్టంగా అనిపించింది)', 'I was unwell (అనారోగ్యంగా ఉన్నాను)', 'I added every day (ప్రతిరోజూ నమోదు చేశాను)']
  },
  {
    id: 'pw_q12',
    text: `12. జననీ మిత్ర యాప్‌తో మీ అనుభవాన్ని రేట్ చేయండి:\nRate your overall experience with the Janani Mitra app (Out of 5 stars):`,
    type: 'rating'
  }
];

export const ashaQuestions: Question[] = [
  {
    id: 'asha_q1',
    text: `1. ఒక గర్భిణీని నమోదు చేయడానికి మీకు ఎంత సమయం పడుతుంది?\nHow long does it take you to register one new mother?`,
    type: 'radio',
    options: ['Under 5 minutes (5 నిమిషాలలోపు)', '5 to 10 minutes (5 నుండి 10 నిమిషాలు)', 'More than 10 minutes (10 నిమిషాల కంటే ఎక్కువ)']
  },
  {
    id: 'asha_q2',
    text: `2. గర్భిణీ యాప్‌ను తెరిచి ప్రతిరోజూ ఆహారం నమోదు చేయగలుగుతుందా?\nIs the mother able to open the app and log her food every day?`,
    type: 'radio',
    options: ['Always (ఎల్లప్పుడూ)', 'Most of the Time (చాలా సమయం)', 'Sometimes (అప్పుడప్పుడు)', 'Not Able to Do It (చేయలేకపోతుంది)']
  },
  {
    id: 'asha_q3',
    text: `3. గర్భిణీ స్త్రీలకు IFA మాత్రలను ట్రాక్ చేయడం ఉపయోగకరంగా ఉందని మీరు భావిస్తున్నారా?\nDo you think tracking IFA tablets for pregnant women is useful?`,
    type: 'radio',
    options: ['Very Useful and Needed (చాలా ఉపయోగకరంగా ఉంది మరియు అవసరం)', 'Useful but Not Essential (ఉపయోగకరంగా ఉంది కానీ తప్పనిసరి కాదు)', 'Not Very Useful (అంత ఉపయోగకరంగా లేదు)', 'Not Needed (అసలు అవసరం లేదు)']
  },
  {
    id: 'asha_q4',
    text: `4. "Your Baby" స్క్రీన్‌లో శిశువు వివరాలు మీకు ఉపయోగకరంగా ఉన్నాయా?\nIs the "Your Baby" screen showing the baby's details helpful to you?`,
    type: 'radio',
    options: ['Helpful (ఉపయోగకరంగా)', 'Somewhat Helpful (కొంత వరకు ఉపయోగకరంగా)', 'Not Helpful (ఉపయోగకరంగా లేదు)']
  },
  {
    id: 'asha_q5',
    text: `5. మీ PIN ఉపయోగించి ASHA Mode (ASHA Visit)కు లాగిన్ అవ్వగలుగుతున్నారా?\nAre you able to log in to ASHA Mode (ASHA Visit) using your PIN?`,
    type: 'radio',
    options: ['Yes, Easily (అవును, సులభంగా)', 'With Some Difficulty (కొంత కష్టంగా)', 'Unable to Login (లాగిన్ అవ్వలేకపోతున్నాను)']
  },
  {
    id: 'asha_q6',
    text: `6. గత 30 రోజుల్లో గర్భిణీ తీసుకున్న Food Group ను మీరు ట్రాక్ చేయగలుగుతున్నారా?\nAre you able to track the mother's food consumption by food group for the last 30 days?`,
    type: 'radio',
    options: ['Easily (సులభంగా)', 'With Some Difficulty (కొంత కష్టంగా)', 'Unable to Track (ట్రాక్ చేయలేకపోతున్నాను)']
  },
  {
    id: 'asha_q7',
    text: `7. యాప్‌ను ఉపయోగించి Food Recall ను సులభంగా చేయగలుగుతున్నారా?\nAre you able to perform a Food Recall of a mother using the app?`,
    type: 'radio',
    options: ['Easily (సులభంగా)', 'With Some Difficulty (కొంత కష్టంగా)', 'Unable to Do It (చేయలేకపోతున్నాను)']
  },
  {
    id: 'asha_q8',
    text: `8. ASHA Visit Summary మీకు ఉపయోగకరంగా ఉందా?\nIs the ASHA Visit Summary useful and easy for you to understand?`,
    type: 'radio',
    options: ['Helpful and Clear (ఉపయోగకరంగా మరియు స్పష్టంగా ఉంది)', 'Somewhat Helpful (కొంత ఉపయోగకరంగా)', 'Not Helpful (ఉపయోగకరంగా లేదు)']
  },
  {
    id: 'asha_q9',
    text: `9. ఒక గర్భిణీ యాప్‌ను ఉపయోగించడం మానేసినప్పుడు, సాధారణ కారణం ఏమిటి?\nWhen a mother stops using the app, what is the usual reason?`,
    type: 'radio',
    options: ['No phone with her (ఆమె దగ్గర ఫోన్ లేదు)', 'She forgets (ఆమె మర్చిపోతుంది)', 'She finds it hard (ఆమెకు కష్టంగా అనిపిస్తుంది)', 'She lost interest (ఆమెకు ఆసక్తి పోయింది)', 'This has not happened (ఇది జరగలేదు)']
  },
  {
    id: 'asha_q10',
    text: `10. ఫీల్డ్‌లో యాప్‌ను ఉపయోగించడంలో కష్టమైన భాగం ఏది?\nWhat is the hardest part of using the app in the field?`,
    type: 'radio',
    options: ['Network problem (నెట్‌వర్క్ సమస్య)', 'Login or PIN (లాగిన్ లేదా PIN సమస్య)', 'Doing the food recall (ఫుడ్ రీకాల్ చేయడం)', 'Registering mothers (గర్భిణీని నమోదు చేయడం)', 'Nothing, it works fine (ఏమీ లేదు, బాగా పనిచేస్తోంది)']
  },
  {
    id: 'asha_q11',
    text: `11. జననీ మిత్ర యాప్‌తో మీ అనుభవాన్ని రేట్ చేయండి:\nRate your overall experience with the Janani Mitra app (Out of 5 stars):`,
    type: 'rating'
  }
];
