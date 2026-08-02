package varmite.verity.entity.AI;

import com.google.gson.JsonObject;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.crafting.CraftingRecipe;
import net.minecraft.world.item.crafting.Ingredient;
import net.minecraft.world.item.crafting.Recipe;
import net.minecraft.world.item.crafting.RecipeManager;
import net.minecraft.world.item.crafting.RecipeType;
import net.minecraftforge.fml.ModList;
import net.minecraftforge.forgespi.language.IModInfo;

import java.util.List;

/**
 * Verity 配方和 Mod 探查辅助类
 * 提供两个新 action：
 * 1. get_recipe - 查询物品的合成配方（支持原版和模组物品）
 * 2. get_all_mods - 探查所有已安装的 mod（ID、名称、版本）
 */
public class VerityRecipeHelper {

    /**
     * 处理新的 action 请求
     * @param action action 名称
     * @param args action 参数
     * @param player 玩家
     * @param serverLevel 服务端世界
     * @return 结果字符串，如果 action 不匹配则返回 null
     */
    public static String handleAction(String action, JsonObject args, ServerPlayer player, ServerLevel serverLevel) {
        try {
            switch (action) {
                case "get_recipe":
                    return getRecipe(args, serverLevel);
                case "get_all_mods":
                    return getAllMods();
                default:
                    return "\u672a\u8bc6\u522b\u7684\u5de5\u5177\u3002";
            }
        } catch (Throwable t) {
            return "\u67e5\u8be2\u5931\u8d25: " + t.getMessage();
        }
    }

    /**
     * 查询物品的合成配方
     * 使用 Minecraft RecipeManager.getAllRecipesFor(RecipeType.CRAFTING)
     * 支持：
     * - 按物品 ID 精确匹配（如 "minecraft:bread" 或 "bread"）
     * - 按物品名称模糊匹配（如 "面包"）
     * - 同时查询合成、熔炼、烟熏、高炉配方
     */
    public static String getRecipe(JsonObject args, ServerLevel serverLevel) {
        String itemId = args.has("item_id") ? args.get("item_id").getAsString().toLowerCase().replace(" ", "_") : "";
        if (itemId.isEmpty()) {
            return "请提供要查询配方的物品ID，例如：{\"item_id\":\"minecraft:bread\"}";
        }

        RecipeManager rm = serverLevel.getRecipeManager();
        StringBuilder result = new StringBuilder();
        int foundCount = 0;

        // 查询合成台配方
        List<CraftingRecipe> craftingRecipes = rm.getAllRecipesFor(RecipeType.CRAFTING);
        for (CraftingRecipe recipe : craftingRecipes) {
            if (matchRecipe(recipe, itemId, serverLevel)) {
                foundCount++;
                if (foundCount > 5) {
                    result.append("... (更多配方省略)\n");
                    break;
                }
                appendRecipe(result, "合成", recipe.getIngredients(),
                    recipe.getResultItem(serverLevel.registryAccess()));
            }
        }

        // 查询熔炉配方
        List<? extends Recipe<?>> smeltingRecipes = rm.getAllRecipesFor(RecipeType.SMELTING);
        for (Recipe<?> recipe : smeltingRecipes) {
            if (matchRecipe(recipe, itemId, serverLevel)) {
                foundCount++;
                if (foundCount > 8) {
                    result.append("... (更多配方省略)\n");
                    break;
                }
                appendRecipe(result, "熔炼", recipe.getIngredients(),
                    recipe.getResultItem(serverLevel.registryAccess()));
            }
        }

        // 查询烟熏炉配方
        List<? extends Recipe<?>> smokingRecipes = rm.getAllRecipesFor(RecipeType.SMOKING);
        for (Recipe<?> recipe : smokingRecipes) {
            if (matchRecipe(recipe, itemId, serverLevel)) {
                foundCount++;
                if (foundCount > 10) {
                    result.append("... (更多配方省略)\n");
                    break;
                }
                appendRecipe(result, "烟熏", recipe.getIngredients(),
                    recipe.getResultItem(serverLevel.registryAccess()));
            }
        }

        // 查询高炉配方
        List<? extends Recipe<?>> blastingRecipes = rm.getAllRecipesFor(RecipeType.BLASTING);
        for (Recipe<?> recipe : blastingRecipes) {
            if (matchRecipe(recipe, itemId, serverLevel)) {
                foundCount++;
                if (foundCount > 12) {
                    result.append("... (更多配方省略)\n");
                    break;
                }
                appendRecipe(result, "高炉", recipe.getIngredients(),
                    recipe.getResultItem(serverLevel.registryAccess()));
            }
        }

        // 查询切石机配方
        List<? extends Recipe<?>> stonecuttingRecipes = rm.getAllRecipesFor(RecipeType.STONECUTTING);
        for (Recipe<?> recipe : stonecuttingRecipes) {
            if (matchRecipe(recipe, itemId, serverLevel)) {
                foundCount++;
                if (foundCount > 14) {
                    result.append("... (更多配方省略)\n");
                    break;
                }
                appendRecipe(result, "切石", recipe.getIngredients(),
                    recipe.getResultItem(serverLevel.registryAccess()));
            }
        }

        if (foundCount == 0) {
            return "未找到物品 '" + itemId + "' 的配方。可能该物品不可合成，或物品ID不正确。";
        }

        return "找到 " + foundCount + " 个配方:\n" + result.toString();
    }

    /**
     * 检查配方的输出物品是否匹配查询
     */
    private static boolean matchRecipe(Recipe<?> recipe, String itemId, ServerLevel serverLevel) {
        try {
            ItemStack resultItem = recipe.getResultItem(serverLevel.registryAccess());
            if (resultItem.isEmpty()) return false;

            // 获取物品的注册 ID
            ResourceLocation regId = BuiltInRegistries.ITEM.getKey(resultItem.getItem());
            String regIdStr = regId.toString().toLowerCase();

            // 精确匹配（含命名空间）
            if (regIdStr.equals(itemId)) return true;

            // 匹配路径部分（不含命名空间）
            String path = regId.getPath();
            if (path.equals(itemId)) return true;

            // 模糊匹配
            if (regIdStr.contains(itemId) || path.contains(itemId)) return true;

            // 按显示名称匹配
            String displayName = resultItem.getHoverName().getString().toLowerCase();
            if (displayName.contains(itemId)) return true;

            return false;
        } catch (Throwable t) {
            return false;
        }
    }

    /**
     * 将配方信息追加到 StringBuilder
     */
    private static void appendRecipe(StringBuilder sb, String type,
                                     List<Ingredient> ingredients, ItemStack resultItem) {
        try {
            sb.append("[").append(type).append("] ");
            sb.append(resultItem.getHoverName().getString());
            sb.append(" x").append(resultItem.getCount());
            sb.append(" (").append(BuiltInRegistries.ITEM.getKey(resultItem.getItem())).append(")");

            if (ingredients != null && !ingredients.isEmpty()) {
                sb.append(" <- 材料: ");
                for (int i = 0; i < ingredients.size(); i++) {
                    Ingredient ing = ingredients.get(i);
                    if (ing == null) continue;
                    ItemStack[] items = ing.getItems();
                    if (items != null && items.length > 0) {
                        sb.append(items[0].getHoverName().getString());
                        if (items[0].getCount() > 1) {
                            sb.append(" x").append(items[0].getCount());
                        }
                    } else {
                        sb.append("任意");
                    }
                    if (i < ingredients.size() - 1) sb.append(", ");
                }
            }
            sb.append("\n");
        } catch (Throwable t) {
            sb.append("[配方解析失败]\n");
        }
    }

    /**
     * 获取所有已安装的 mod 列表
     * 返回 mod ID、显示名称、版本
     */
    public static String getAllMods() {
        List<IModInfo> mods = ModList.get().getMods();
        StringBuilder sb = new StringBuilder();
        sb.append("已安装 ").append(mods.size()).append(" 个模组:\n");

        for (IModInfo mod : mods) {
            sb.append("- ").append(mod.getModId())
              .append(" v").append(mod.getVersion())
              .append(" (").append(mod.getDisplayName()).append(")\n");
        }

        return sb.toString();
    }
}
