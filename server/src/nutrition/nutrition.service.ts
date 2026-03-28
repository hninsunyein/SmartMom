import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NutritionPlan } from '../database/entities/nutrition-plan.entity';
import { ParentMealSelection } from '../database/entities/parent-meal-selection.entity';
import { SelectedMealPlanItem } from '../database/entities/selected-meal-plan-item.entity';

const FOOD_CALORIES: Record<string, number> = {
  rice: 130, bread: 265, noodles: 138, egg: 155,
  chicken: 239, fish: 206, milk: 61, banana: 89, apple: 52,
};

const AGE_MEALS: Record<string, Record<string, string[][]>> = {
  '0-2': {
    breakfast: [
      ['Breast milk / Formula', 'Mashed banana'],
      ['Rice porridge', 'Pureed sweet potato', 'Breast milk'],
      ['Oat cereal', 'Mashed avocado', 'Formula'],
      ['Soft scrambled egg', 'Pureed carrot', 'Warm water'],
      ['Mashed potato', 'Steamed pumpkin puree', 'Milk'],
    ],
    lunch: [
      ['Rice porridge', 'Pureed chicken', 'Mashed peas'],
      ['Soft tofu', 'Steamed fish puree', 'Rice water'],
      ['Lentil soup', 'Soft steamed broccoli', 'Breast milk'],
      ['Mashed pumpkin', 'Pureed beef', 'Warm formula'],
      ['Vegetable puree soup', 'Soft bread', 'Warm milk'],
    ],
    dinner: [
      ['Warm rice porridge', 'Pureed spinach', 'Warm water'],
      ['Mashed sweet potato', 'Chicken broth', 'Breast milk'],
      ['Soft oatmeal', 'Banana puree', 'Formula'],
      ['Vegetable puree', 'Soft tofu mash', 'Warm milk'],
      ['Rice cereal', 'Pureed mango', 'Breast milk'],
    ],
  },
  '3-5': {
    breakfast: [
      ['Milk', 'Banana', 'Oatmeal'],
      ['Scrambled eggs', 'Toast', 'Orange juice'],
      ['Yogurt', 'Mixed berries', 'Granola'],
      ['Pancake', 'Honey', 'Warm milk'],
      ['Fried egg', 'Rice', 'Sliced cucumber'],
      ['Cereal with milk', 'Sliced apple', 'Water'],
      ['French toast', 'Strawberry jam', 'Milk'],
    ],
    lunch: [
      ['Rice', 'Fish curry', 'Steamed vegetables'],
      ['Noodle soup', 'Chicken', 'Carrot'],
      ['Fried rice', 'Egg', 'Corn'],
      ['Chicken congee', 'Sliced ginger', 'Green onion'],
      ['Sandwich', 'Cheese', 'Tomato', 'Apple'],
      ['Mac and cheese', 'Steamed broccoli'],
      ['Rice', 'Stir-fried pork', 'Cabbage'],
    ],
    dinner: [
      ['Rice', 'Steamed chicken', 'Pumpkin soup'],
      ['Chicken noodle soup', 'Soft bread'],
      ['Rice', 'Egg omelette', 'Stir-fried greens'],
      ['Fish porridge', 'Ginger', 'Spring onion'],
      ['Pasta', 'Minced meat sauce', 'Cheese'],
      ['Rice', 'Tofu', 'Vegetable stir-fry'],
      ['Soft flatbread', 'Lentil soup', 'Yogurt'],
    ],
  },
  '6-12': {
    breakfast: [
      ['Whole grain toast', 'Peanut butter', 'Banana', 'Milk'],
      ['Boiled eggs x2', 'Rice', 'Sliced tomato'],
      ['Oatmeal', 'Dried fruits', 'Nuts', 'Orange juice'],
      ['Cheese sandwich', 'Apple', 'Milk'],
      ['Fried rice', 'Vegetable', 'Sunny-side egg'],
      ['Yogurt parfait', 'Granola', 'Mixed berries'],
      ['Pancakes', 'Syrup', 'Milk', 'Sliced banana'],
    ],
    lunch: [
      ['Rice', 'Grilled chicken', 'Salad', 'Water'],
      ['Noodles', 'Stir-fried beef', 'Vegetables'],
      ['Baked potato', 'Cheese', 'Steamed broccoli', 'Milk'],
      ['Fried rice', 'Shrimp', 'Carrot', 'Egg'],
      ['Sandwich', 'Turkey', 'Lettuce', 'Tomato', 'Fruit juice'],
      ['Rice', 'Fish fillet', 'Steamed corn'],
      ['Pasta salad', 'Tuna', 'Cherry tomatoes', 'Olive oil'],
    ],
    dinner: [
      ['Rice', 'Beef stew', 'Steamed broccoli'],
      ['Grilled fish', 'Brown rice', 'Mixed salad'],
      ['Spaghetti', 'Meat sauce', 'Garlic bread'],
      ['Chicken soup', 'Rice', 'Steamed vegetables'],
      ['Stir-fried tofu', 'Rice', 'Bok choy'],
      ['Baked salmon', 'Mashed potato', 'Green beans'],
      ['Rice', 'Egg curry', 'Cucumber salad'],
    ],
  },
  '13-18': {
    breakfast: [
      ['Whole grain toast x2', 'Avocado', 'Poached egg', 'Orange juice'],
      ['Protein smoothie', 'Banana', 'Peanut butter', 'Oats'],
      ['Oatmeal', 'Chia seeds', 'Mixed nuts', 'Honey', 'Milk'],
      ['Rice', 'Fried egg', 'Stir-fried vegetables'],
      ['Greek yogurt', 'Berries', 'Granola', 'Honey'],
      ['Whole wheat sandwich', 'Cheese', 'Tomato', 'Milk'],
      ['Scrambled eggs x3', 'Brown rice', 'Spinach'],
    ],
    lunch: [
      ['Brown rice', 'Grilled chicken breast', 'Steamed broccoli', 'Water'],
      ['Whole wheat pasta', 'Tuna', 'Olive oil', 'Cherry tomatoes'],
      ['Rice', 'Stir-fried beef', 'Mixed vegetables'],
      ['Large salad', 'Grilled salmon', 'Whole grain bread'],
      ['Chicken wrap', 'Lettuce', 'Tomato', 'Low-fat yogurt'],
      ['Fried rice', 'Shrimp', 'Egg', 'Vegetables'],
      ['Noodles', 'Lean pork', 'Bok choy', 'Broth'],
    ],
    dinner: [
      ['Grilled salmon', 'Quinoa', 'Steamed asparagus'],
      ['Lean beef steak', 'Brown rice', 'Roasted vegetables'],
      ['Chicken breast', 'Sweet potato', 'Green salad'],
      ['Baked cod', 'Pasta', 'Tomato sauce', 'Salad'],
      ['Tofu stir-fry', 'Brown rice', 'Mixed greens'],
      ['Rice', 'Egg plant curry', 'Yogurt'],
      ['Turkey meatballs', 'Whole wheat spaghetti', 'Marinara sauce'],
    ],
  },
};

const GOAL_BOOSTS: Record<string, Record<string, string[][]>> = {
  weight_gain: {
    breakfast: [
      ['Peanut butter toast', 'Full-fat milk', 'Banana', 'Honey'],
      ['Eggs x2', 'Avocado toast', 'Whole milk', 'Orange juice'],
      ['Oatmeal', 'Full cream', 'Peanut butter', 'Banana'],
    ],
    lunch: [
      ['Rice x2 servings', 'Chicken thigh', 'Fried egg', 'Vegetables'],
      ['Pasta', 'Meat bolognese', 'Cheese', 'Garlic bread'],
      ['Fried rice', 'Pork', 'Egg x2', 'Corn'],
    ],
    dinner: [
      ['Rice', 'Beef stew', 'Potato', 'Bread'],
      ['Chicken leg', 'Mashed potato with butter', 'Steamed carrot'],
      ['Pasta', 'Cream sauce', 'Chicken', 'Cheese'],
    ],
  },
  height_growth: {
    breakfast: [
      ['Full-fat milk', 'Cheese toast', 'Boiled egg', 'Orange juice'],
      ['Yogurt', 'Almonds', 'Chia seeds', 'Honey'],
      ['Fortified cereal', 'Milk', 'Banana'],
    ],
    lunch: [
      ['Salmon', 'Brown rice', 'Spinach', 'Milk'],
      ['Chicken', 'Broccoli', 'Cheese', 'Milk'],
      ['Sardine rice', 'Green vegetables', 'Yogurt'],
    ],
    dinner: [
      ['Grilled fish', 'Rice', 'Milk before bed'],
      ['Tofu', 'Edamame', 'Brown rice', 'Miso soup'],
      ['Chicken soup', 'Cheese bread', 'Warm milk'],
    ],
  },
  immunity_boost: {
    breakfast: [
      ['Orange juice', 'Egg', 'Spinach omelette', 'Whole toast'],
      ['Smoothie (orange + mango + ginger)', 'Greek yogurt'],
      ['Berries', 'Honey', 'Yogurt', 'Granola'],
    ],
    lunch: [
      ['Tomato soup', 'Garlic bread', 'Salad', 'Water with lemon'],
      ['Chicken turmeric rice', 'Steamed broccoli', 'Ginger tea'],
      ['Lentil vegetable soup', 'Brown rice', 'Yogurt'],
    ],
    dinner: [
      ['Garlic chicken', 'Quinoa', 'Steamed vegetables'],
      ['Fish curry', 'Rice', 'Cucumber', 'Lemon water'],
      ['Vegetable stew', 'Brown rice', 'Probiotic yogurt'],
    ],
  },
};

function shuffleAndPick<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

@Injectable()
export class NutritionService {
  constructor(
    @InjectRepository(NutritionPlan)
    private planRepository: Repository<NutritionPlan>,
    @InjectRepository(ParentMealSelection)
    private selectionRepository: Repository<ParentMealSelection>,
    @InjectRepository(SelectedMealPlanItem)
    private itemRepository: Repository<SelectedMealPlanItem>,
  ) {}

  // ── Legacy ────────────────────────────────────────────────────────────────

  async findByChild(childId: number) {
    const plans = await this.planRepository.find({
      where: { childId },
      order: { planDate: 'DESC' },
    });
    return { success: true, data: plans };
  }

  async createPlan(data: any) {
    const plan = this.planRepository.create(data);
    const saved = await this.planRepository.save(plan);
    return { success: true, data: saved };
  }

  generateMealPlan(ageGroup: string, goals: string[]) {
    const ageMeals = AGE_MEALS[ageGroup] || AGE_MEALS['3-5'];
    const allBreakfast = [...ageMeals.breakfast];
    const allLunch = [...ageMeals.lunch];
    const allDinner = [...ageMeals.dinner];

    for (const goal of goals) {
      const boost = GOAL_BOOSTS[goal];
      if (boost) {
        allBreakfast.push(...boost.breakfast);
        allLunch.push(...boost.lunch);
        allDinner.push(...boost.dinner);
      }
    }

    const breakfast = shuffleAndPick(allBreakfast, 5).map(items => items.join(' + '));
    const lunch = shuffleAndPick(allLunch, 5).map(items => items.join(' + '));
    const dinner = shuffleAndPick(allDinner, 5).map(items => items.join(' + '));

    const ageGroupLabels: Record<string, string> = {
      '0-2': '0-2 years (Infant)', '3-5': '3-5 years (Toddler)',
      '6-12': '6-12 years (School Age)', '13-18': '13-18 years (Teen)',
    };

    return { success: true, data: { ageGroup, ageGroupLabel: ageGroupLabels[ageGroup] || ageGroup, goals, breakfast, lunch, dinner } };
  }

  calculateCalories(foodItem: string, amount: number) {
    const key = foodItem.toLowerCase();
    const caloriesPer100 = FOOD_CALORIES[key];
    if (!caloriesPer100) return { success: false, message: 'Food item not found' };
    const totalCalories = Math.round((caloriesPer100 * amount) / 100);
    return { success: true, data: { foodItem, amount, caloriesPer100, totalCalories } };
  }

  // ── Monthly plan restriction ──────────────────────────────────────────────

  async checkCurrentMonthPlan(childId: number) {
    const now = new Date();
    const count = await this.planRepository
      .createQueryBuilder('np')
      .where('np.child_id = :childId', { childId })
      .andWhere('YEAR(np.created_at) = :year', { year: now.getFullYear() })
      .andWhere('MONTH(np.created_at) = :month', { month: now.getMonth() + 1 })
      .getCount();

    return { success: true, data: { exists: count > 0 } };
  }

  async deleteCurrentMonthPlan(parentId: number, childId: number) {
    const now = new Date();

    // Delete from nutrition_plans (current month)
    await this.planRepository
      .createQueryBuilder()
      .delete()
      .from(NutritionPlan)
      .where('child_id = :childId', { childId })
      .andWhere('YEAR(created_at) = :year', { year: now.getFullYear() })
      .andWhere('MONTH(created_at) = :month', { month: now.getMonth() + 1 })
      .execute();

    // Delete from parent_meal_selections (cascades to selected_meal_plan_items)
    const selections = await this.selectionRepository.find({
      where: { parentId, childId },
    });
    for (const sel of selections) {
      await this.itemRepository.delete({ selectionId: sel.id });
    }
    await this.selectionRepository.delete({ parentId, childId });

    return { success: true };
  }

  // ── Save meal selection (Free & Premium) → writes to nutrition_plans ──────

  async saveMealSelection(
    parentId: number,
    isPremium: boolean,
    body: {
      childId: number;
      ageGroup: string;
      goals: string[];
      mealPlan: { breakfast: string[]; lunch: string[]; dinner: string[] };
      bmiValue?: number;
      selectedMeals?: { week: number; day: number; breakfast: string; lunch: string; dinner: string }[];
    },
  ) {
    const planVersion = isPremium ? 'premium' : 'free';
    const now = new Date();

    // ── 1. Clean up parent_meal_selections for this child ──────────────────
    if (!isPremium) {
      const existing = await this.selectionRepository.findOne({
        where: { parentId, childId: body.childId },
      });
      if (existing) {
        await this.itemRepository.delete({ selectionId: existing.id });
        await this.selectionRepository.delete(existing.id);
      }
    } else {
      await this.selectionRepository.update(
        { parentId, childId: body.childId, isActive: 1 },
        { isActive: 0 },
      );
    }

    // ── 2. Create parent_meal_selections record ────────────────────────────
    const selection = this.selectionRepository.create({
      parentId,
      childId: body.childId,
      ageGroup: body.ageGroup,
      nutritionGoal: body.goals.join(','),
      planVersion,
      bmiValue: body.bmiValue ?? null,
      isActive: 1,
    });
    const savedSelection = await this.selectionRepository.save(selection);

    // ── 3. Build meal slots ────────────────────────────────────────────────
    const mp = body.mealPlan;
    const weekSlots: { week: number; day: number; breakfast: string; lunch: string; dinner: string }[] = [];

    if (!isPremium) {
      weekSlots.push({ week: 1, day: 1, breakfast: mp.breakfast[0], lunch: mp.lunch[0], dinner: mp.dinner[0] });
    } else {
      const provided = body.selectedMeals;
      if (provided && provided.length > 0) {
        weekSlots.push(...provided);
      } else {
        for (let w = 1; w <= 4; w++) {
          for (let d = 1; d <= 7; d++) {
            const idx = ((w - 1) * 7 + (d - 1)) % mp.breakfast.length;
            weekSlots.push({
              week: w, day: d,
              breakfast: mp.breakfast[idx % mp.breakfast.length],
              lunch:     mp.lunch[idx % mp.lunch.length],
              dinner:    mp.dinner[idx % mp.dinner.length],
            });
          }
        }
      }
    }

    // ── 4. Save to selected_meal_plan_items ───────────────────────────────
    const items: Partial<SelectedMealPlanItem>[] = [];
    for (const slot of weekSlots) {
      items.push(
        { selectionId: savedSelection.id, mealPlanId: slot.breakfast, weekNumber: slot.week, dayNumber: slot.day, mealTime: 'breakfast' },
        { selectionId: savedSelection.id, mealPlanId: slot.lunch,     weekNumber: slot.week, dayNumber: slot.day, mealTime: 'lunch'     },
        { selectionId: savedSelection.id, mealPlanId: slot.dinner,    weekNumber: slot.week, dayNumber: slot.day, mealTime: 'dinner'    },
      );
    }
    await this.itemRepository.save(items as SelectedMealPlanItem[]);

    // ── 5. Delete this month's nutrition_plans for child, then re-save ────
    await this.planRepository
      .createQueryBuilder()
      .delete()
      .from(NutritionPlan)
      .where('child_id = :childId', { childId: body.childId })
      .andWhere('YEAR(created_at) = :year', { year: now.getFullYear() })
      .andWhere('MONTH(created_at) = :month', { month: now.getMonth() + 1 })
      .execute();

    const nutritionPlanRows = weekSlots.map(slot => {
      const planDate = new Date(now);
      planDate.setDate(now.getDate() + (slot.week - 1) * 7 + (slot.day - 1));
      return this.planRepository.create({
        childId: body.childId,
        planDate,
        ageGroup: body.ageGroup,
        goals: body.goals,
        breakfast: slot.breakfast,
        lunch: slot.lunch,
        dinner: slot.dinner,
        notes: `Week:${slot.week},Day:${slot.day}`,
      });
    });
    await this.planRepository.save(nutritionPlanRows);

    return { success: true, data: savedSelection };
  }

  // ── Get active plan for a child ───────────────────────────────────────────

  async getActivePlan(parentId: number, childId: number) {
    const selection = await this.selectionRepository.findOne({
      where: { parentId, childId, isActive: 1 },
      order: { generatedDate: 'DESC' },
    });
    if (!selection) return { success: true, data: null };

    const items = await this.itemRepository.find({
      where: { selectionId: selection.id },
      order: { weekNumber: 'ASC', dayNumber: 'ASC', mealTime: 'ASC' },
    });
    return { success: true, data: { ...selection, items } };
  }

  async checkFreePlanExists(parentId: number, childId: number) {
    const existing = await this.selectionRepository.findOne({
      where: { parentId, childId, planVersion: 'free' },
    });
    return { success: true, data: { exists: !!existing } };
  }

  // ── Plan history — reads from nutrition_plans, grouped by month ───────────

  async getPlanHistory(parentId: number, childId: number, isPremium: boolean) {
    if (!isPremium) throw new ForbiddenException('Plan history requires premium plan');

    const plans = await this.planRepository.find({
      where: { childId },
      order: { createdAt: 'DESC' },
    });

    // Group by YYYY-MM of createdAt
    const monthMap = new Map<string, {
      year: number; month: number; monthLabel: string;
      generatedDate: Date; ageGroup: string; goals: string[]; recordCount: number;
    }>();

    for (const plan of plans) {
      const d = new Date(plan.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!monthMap.has(key)) {
        monthMap.set(key, {
          year: d.getFullYear(),
          month: d.getMonth(),
          monthLabel: d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
          generatedDate: plan.createdAt,
          ageGroup: plan.ageGroup,
          goals: plan.goals,
          recordCount: 0,
        });
      }
      monthMap.get(key).recordCount++;
    }

    return { success: true, data: Array.from(monthMap.values()) };
  }

  // ── Get a specific month's plan records ───────────────────────────────────

  async getMonthPlan(childId: number, year: number, month: number, isPremium: boolean) {
    if (!isPremium) throw new ForbiddenException('Plan history requires premium plan');

    const records = await this.planRepository
      .createQueryBuilder('np')
      .where('np.child_id = :childId', { childId })
      .andWhere('YEAR(np.created_at) = :year', { year })
      .andWhere('MONTH(np.created_at) = :month', { month: month + 1 }) // JS month is 0-indexed
      .orderBy('np.plan_date', 'ASC')
      .getMany();

    return { success: true, data: records };
  }

  // ── Shopping list — premium only ─────────────────────────────────────────

  async getShoppingList(parentId: number, selectionId: number, isPremium: boolean) {
    if (!isPremium) throw new ForbiddenException('Shopping list requires premium plan');

    const selection = await this.selectionRepository.findOne({ where: { id: selectionId, parentId } });
    if (!selection) throw new NotFoundException('Meal plan not found');

    const items = await this.itemRepository.find({ where: { selectionId } });
    const ingredients = new Set<string>();
    for (const item of items) {
      item.mealPlanId.split(' + ').forEach(ing => ingredients.add(ing.trim()));
    }
    return { success: true, data: Array.from(ingredients).sort() };
  }
}
