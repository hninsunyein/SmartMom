import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NutritionPlan } from '../database/entities/nutrition-plan.entity';

const FOOD_CALORIES: Record<string, number> = {
  rice: 130,
  bread: 265,
  noodles: 138,
  egg: 155,
  chicken: 239,
  fish: 206,
  milk: 61,
  banana: 89,
  apple: 52,
};

// Age-group specific meal database
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

// Goal-specific meal boosters
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

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleAndPick<T>(arr: T[], n: number): T[] {
  const copy = [...arr].sort(() => Math.random() - 0.5);
  return copy.slice(0, n);
}

@Injectable()
export class NutritionService {
  constructor(
    @InjectRepository(NutritionPlan)
    private planRepository: Repository<NutritionPlan>,
  ) {}

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

    // Collect all options per meal from age group + goals
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

    // Pick 5 random unique options per meal
    const breakfast = shuffleAndPick(allBreakfast, 5).map(items => items.join(' + '));
    const lunch = shuffleAndPick(allLunch, 5).map(items => items.join(' + '));
    const dinner = shuffleAndPick(allDinner, 5).map(items => items.join(' + '));

    const ageGroupLabels: Record<string, string> = {
      '0-2': '0–2 years (Infant)',
      '3-5': '3–5 years (Toddler)',
      '6-12': '6–12 years (School Age)',
      '13-18': '13–18 years (Teen)',
    };

    return {
      success: true,
      data: {
        ageGroup,
        ageGroupLabel: ageGroupLabels[ageGroup] || ageGroup,
        goals,
        breakfast,
        lunch,
        dinner,
      },
    };
  }

  calculateCalories(foodItem: string, amount: number) {
    const key = foodItem.toLowerCase();
    const caloriesPer100 = FOOD_CALORIES[key];
    if (!caloriesPer100) {
      return { success: false, message: 'Food item not found' };
    }
    const totalCalories = Math.round((caloriesPer100 * amount) / 100);
    return {
      success: true,
      data: {
        foodItem,
        amount,
        caloriesPer100,
        totalCalories,
      },
    };
  }
}
