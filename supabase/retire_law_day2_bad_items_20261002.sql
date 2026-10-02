-- Retire faulty legacy Day 2 PharmacyLaw items (status 'review' hides them from users; set back to 'active' to revert).
-- Replacements: supabase/seed_pharmacy_law_day2.sql (question_number 37+).

-- 1) 41 near-duplicate drug-classification items. Many cite the repealed
--    พ.ร.บ.วัตถุออกฤทธิ์ 2559 or are wrong (methamphetamine as "วัตถุออกฤทธิ์ประเภท 2",
--    tramadol as a psychotropic); 15 were the same isotretinoin question. One correct
--    isotretinoin item (f77a6fb7…) is kept.
UPDATE public.mcq_questions SET status = 'review', ai_notes = coalesce(ai_notes,'') || ' | retired 2026-10-02: duplicate/incorrect classification'
WHERE id IN (
  'd8816915522f588315290525a092a45a', 'e0c125cda790eaf862801ad7625357cf', '4598844ebb429baa2339371234e2a324',
  '5d3da54a1ef68993b487ddd1e8ee65cf', '1cbf801fd4c3937244b57c5fa98906cc', '324b3efc3da123f4fcedaed1e640af0e',
  '9ed08c0fa5f44003e65ba8add7c72014', '416ce07b803252eaa0b5f28921cf9e42', '00993e2c92641efb5e8b73bf26ac14a5',
  'f345912a9682a22f84f094f161c987e4', '48259dc8ab2f1e212da30669d8298939', '1f6fe30961144509a82eeaa2a5571498',
  '0a7a97ede079583a5ac3afd31857b2a1', 'f987a0405d6437a22eba2f70a34db3d7', '4f112e2c33e813bba53293ad89e00306',
  '53f293311a600827fd4c0074713f0470', '2a6e93beb804b2657bb897093b1bb455', 'd70dd655abe8aecad4709ea4b3118fb0',
  'ddddf95f73d2e9244c88491a9f5dba4a', 'fca3f502cfac8bdb6b1105c30b32d00f', '854bfaf3ad869de2e56c15ce7ba7cf81',
  '5879a0c6bdfb803dd4ce426e5b6ea48b', '94d8c55baf14758873e1ef6c4351b662', 'f5f66df28d80ea6d1a9419c934682832',
  '5f24272874bea2fe6e2095590bf50bd5', '4ea1c9f0a32c1592d1f60f322fba6ebb', '69cf311c2364d282b23f8a1e895e16a7',
  '162ad89a686ea37abf3ea1665f25eac2', '333633891889813c82155b5f5e689464', '089b9053b775c845dd87da72c4c378ac',
  '268e4d3f3c03696fbffded1627fd7765', '4224377991e55b22edff694bcdbe6643', 'b41e08850e74e535f51c184a0a689307',
  '3e3a6e96ce95636129749771aad4a947', '70b3e94e99dd3947e1dbeaaa3f8485b0', '848f6305e5f2f7642232b869f962e24d',
  '0e1ad6422ba6f517190791183a410302', 'b6d4212591bc8c4f5d2432c2bdb03a42', '866b40a50311f56870e1746d4904bb67',
  '6a78105a3538b6fa57fa14e3be996f0a', '1ad182b3d6de3cd99181680d90213f0c'
);

-- 2) 14 scenario items whose answer rests on the repealed 2559/2522 laws or a wrong schedule
--    (e.g. alprazolam/zolpidem/clonazepam/diazepam categories, tramadol as ยาเสพติดประเภท 2, MDMA as วัตถุออกฤทธิ์).
UPDATE public.mcq_questions SET status = 'review', ai_notes = coalesce(ai_notes,'') || ' | retired 2026-10-02: cites repealed law / wrong schedule'
WHERE id IN (
  'd97ef8f38382834074e6aef38dc85588', 'dd9fe2e5417367dc3e33d0d6d50f6946', '590b47c4a21a67e64799e23554964b8c',
  'a065bf1be3f1015ada268adc6989956b', '844cf0a33ad0c6f702c2e1b7a272531f', '11dde228503453b7abdeba69db9e2f2c',
  'ff12e1f8f449e4f3d9c4019bab7eeb2a', '696b8c7c60cb7c4e6ef667e8ca7f4ffd', 'ff4f9f155af1feb2322195e939e62fe2',
  '0648c2327dc35a3080541ccf1e3ed46d', '66df13015312d3af4e196d6589059509', 'a7a054a4f0dd6df79b71f9ba0dad9d64',
  'a8aac0320191fef46649712f03b110a2', '6b4cbbed34fd86062382d03820d0ceda'
);

-- 3) GPP-framed item whose answer is a drug interaction → PharmCare (same exam day).
UPDATE public.mcq_questions SET subject_id = (SELECT id FROM public.mcq_subjects WHERE name = 'PharmCare')
WHERE id = '14516040d5d1813a68ebaf1e8ec9c3f6';
