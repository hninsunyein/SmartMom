-- ============================================================
--  Smart Mom — Nutrition Plans Seed
--  Covers all 4 age groups × 3 goals = 12 plans + 1 mixed
--
--  IMPORTANT: Change @child_id to a real child ID in your DB
--  Run: mysql -u smart_mom_user -p smart_mom_db < seed-nutrition-plans.sql
-- ============================================================

SET @child_id = 1;   -- ← change this to a valid child ID
SET @today    = CURDATE();

INSERT INTO nutrition_plans
  (child_id, plan_date, age_group, goals, breakfast, lunch, dinner, notes)
VALUES

-- ── 0-2 years ─────────────────────────────────────────────────────────────────

(@child_id, @today, '0-2', 'weight_gain',
 'Breast milk / Formula + Mashed banana + Peanut butter toast + Full-fat milk + Honey',
 'Rice porridge + Pureed chicken + Mashed peas + Rice x2 servings + Chicken thigh + Fried egg',
 'Warm rice porridge + Pureed spinach + Warm water + Rice + Beef stew + Potato + Bread',
 'Seed: 0-2 / weight_gain'),

(@child_id, DATE_ADD(@today, INTERVAL 1 DAY), '0-2', 'height_growth',
 'Breast milk / Formula + Mashed banana + Full-fat milk + Cheese toast + Boiled egg',
 'Rice porridge + Pureed chicken + Mashed peas + Salmon + Brown rice + Spinach + Milk',
 'Warm rice porridge + Pureed spinach + Warm milk + Grilled fish + Rice + Milk before bed',
 'Seed: 0-2 / height_growth'),

(@child_id, DATE_ADD(@today, INTERVAL 2 DAY), '0-2', 'immunity_boost',
 'Breast milk / Formula + Mashed banana + Orange juice + Egg + Spinach omelette + Whole toast',
 'Rice porridge + Pureed chicken + Mashed peas + Tomato soup + Garlic bread + Lemon water',
 'Warm rice porridge + Pureed spinach + Warm water + Garlic chicken + Quinoa + Steamed vegetables',
 'Seed: 0-2 / immunity_boost'),

-- ── 3-5 years ─────────────────────────────────────────────────────────────────

(@child_id, DATE_ADD(@today, INTERVAL 3 DAY), '3-5', 'weight_gain',
 'Milk + Banana + Oatmeal + Peanut butter toast + Full-fat milk + Banana + Honey',
 'Rice + Fish curry + Steamed vegetables + Rice x2 servings + Chicken thigh + Fried egg',
 'Rice + Steamed chicken + Pumpkin soup + Rice + Beef stew + Potato + Bread',
 'Seed: 3-5 / weight_gain'),

(@child_id, DATE_ADD(@today, INTERVAL 4 DAY), '3-5', 'height_growth',
 'Milk + Banana + Oatmeal + Full-fat milk + Cheese toast + Boiled egg + Orange juice',
 'Rice + Fish curry + Steamed vegetables + Salmon + Brown rice + Spinach + Milk',
 'Rice + Steamed chicken + Pumpkin soup + Grilled fish + Rice + Milk before bed',
 'Seed: 3-5 / height_growth'),

(@child_id, DATE_ADD(@today, INTERVAL 5 DAY), '3-5', 'immunity_boost',
 'Milk + Banana + Oatmeal + Orange juice + Egg + Spinach omelette + Whole toast',
 'Rice + Fish curry + Steamed vegetables + Tomato soup + Garlic bread + Salad + Lemon water',
 'Rice + Steamed chicken + Pumpkin soup + Garlic chicken + Quinoa + Steamed vegetables',
 'Seed: 3-5 / immunity_boost'),

-- ── 6-12 years ────────────────────────────────────────────────────────────────

(@child_id, DATE_ADD(@today, INTERVAL 6 DAY), '6-12', 'weight_gain',
 'Whole grain toast + Peanut butter + Banana + Milk + Eggs x2 + Avocado toast + Orange juice',
 'Rice + Grilled chicken + Salad + Water + Rice x2 servings + Chicken thigh + Fried egg + Vegetables',
 'Rice + Beef stew + Steamed broccoli + Rice + Beef stew + Potato + Bread',
 'Seed: 6-12 / weight_gain'),

(@child_id, DATE_ADD(@today, INTERVAL 7 DAY), '6-12', 'height_growth',
 'Whole grain toast + Peanut butter + Banana + Milk + Full-fat milk + Cheese toast + Boiled egg',
 'Rice + Grilled chicken + Salad + Water + Salmon + Brown rice + Spinach + Milk',
 'Rice + Beef stew + Steamed broccoli + Grilled fish + Rice + Milk before bed',
 'Seed: 6-12 / height_growth'),

(@child_id, DATE_ADD(@today, INTERVAL 8 DAY), '6-12', 'immunity_boost',
 'Whole grain toast + Peanut butter + Banana + Milk + Orange juice + Egg + Spinach omelette',
 'Rice + Grilled chicken + Salad + Water + Tomato soup + Garlic bread + Salad + Lemon water',
 'Rice + Beef stew + Steamed broccoli + Garlic chicken + Quinoa + Steamed vegetables',
 'Seed: 6-12 / immunity_boost'),

-- ── 13-18 years ───────────────────────────────────────────────────────────────

(@child_id, DATE_ADD(@today, INTERVAL 9 DAY), '13-18', 'weight_gain',
 'Whole grain toast x2 + Avocado + Poached egg + OJ + Peanut butter toast + Full-fat milk + Banana',
 'Brown rice + Grilled chicken breast + Steamed broccoli + Pasta + Meat bolognese + Cheese + Garlic bread',
 'Grilled salmon + Quinoa + Steamed asparagus + Rice + Beef stew + Potato + Bread',
 'Seed: 13-18 / weight_gain'),

(@child_id, DATE_ADD(@today, INTERVAL 10 DAY), '13-18', 'height_growth',
 'Whole grain toast x2 + Avocado + Poached egg + OJ + Full-fat milk + Cheese toast + Boiled egg',
 'Brown rice + Grilled chicken breast + Steamed broccoli + Salmon + Brown rice + Spinach + Milk',
 'Grilled salmon + Quinoa + Steamed asparagus + Grilled fish + Rice + Milk before bed',
 'Seed: 13-18 / height_growth'),

(@child_id, DATE_ADD(@today, INTERVAL 11 DAY), '13-18', 'immunity_boost',
 'Whole grain toast x2 + Avocado + Poached egg + Orange juice + Smoothie (orange + mango + ginger) + Greek yogurt',
 'Brown rice + Grilled chicken breast + Steamed broccoli + Chicken turmeric rice + Steamed broccoli + Ginger tea',
 'Grilled salmon + Quinoa + Steamed asparagus + Garlic chicken + Quinoa + Steamed vegetables',
 'Seed: 13-18 / immunity_boost'),

-- ── Mixed plan (all 3 goals combined, representative age 6-12) ────────────────

(@child_id, DATE_ADD(@today, INTERVAL 12 DAY), '6-12', 'weight_gain,height_growth,immunity_boost',
 'Whole grain toast + Peanut butter + Banana + Full-fat milk + Boiled egg + Orange juice + Smoothie (orange + mango + ginger)',
 'Rice + Grilled chicken + Salad + Salmon + Brown rice + Spinach + Tomato soup + Garlic bread + Lemon water',
 'Rice + Beef stew + Broccoli + Grilled fish + Milk before bed + Garlic chicken + Quinoa + Probiotic yogurt',
 'Seed: Mixed plan - weight_gain + height_growth + immunity_boost');
