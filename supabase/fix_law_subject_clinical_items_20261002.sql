-- PharmacyLaw (กฎหมายยาและจริยธรรม) contained daily-generated items that are pure
-- pharmacotherapy cases (drug choice, dosing, interactions) with no legal point,
-- because the generator prompt forced patient/lab context on every medium/hard item.
-- Move them to PharmCare (การบริบาลทางเภสัชกรรม, same exam_type/exam_day 2).
-- Items whose answer hinges on law/ethics/pharmacovigilance stay in PharmacyLaw.
-- Revert: swap the two subject names below.
UPDATE public.mcq_questions q
SET subject_id = (SELECT id FROM public.mcq_subjects WHERE name = 'PharmCare')
WHERE q.subject_id = (SELECT id FROM public.mcq_subjects WHERE name = 'PharmacyLaw')
  AND left(q.id, 8) IN (
    'd57668b4','2f89330a','d53e4bec','103bf444','133c7b65','60e39989','a0011660',
    '9629c553','d4ee770d','8bdc1b28','4dbf7595','7b6bbc5a','0455d88e','9ce57f31',
    'a5da3404','0698f609','41334488','2b7acf18','0629659a','8db604ef','8e52e3d1',
    'f82a84a7','7da8ce68','d5214637','7dfd3600','9de3c8bf','e5fc56d8','b0e1c22c',
    '3d08a18a','1e6efdf6','68dd6f2c','e6bd25c6','f9ef5a69','8d4a0ae9','aa19378c',
    '50cb49d9','b75e7f9f','a42fd68b','b1f00218','bf75b692','8b6859b7',
    'bf7ca0d6','5a2c7989','f38afbe9','deabfcc8','d9bbef2a','fc1ffb8d','c20ca528'
  );
