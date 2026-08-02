package varmite.verity.mixin;

import net.minecraft.world.entity.Entity;
import net.minecraft.world.item.Item;
import net.minecraftforge.event.entity.EntityJoinLevelEvent;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

import varmite.verity.VerityModFlags;

/**
 * 拦截 ModEvents：
 * 1. canDropItem - 老版物品给予机制开关 ON 时跳过黑名单
 * 2. entitySpawnEvent - 友好模式 ON 时跳过杀生物逻辑（非 VerityEntity 直接返回）
 */
@Mixin(targets = "varmite.verity.event.ModEvents", remap = false)
public class ModEventsMixin {

    static {
        System.out.println("[VerityMixin] ModEventsMixin LOADED (target=ModEvents)");
    }

    @Inject(method = "canDropItem", at = @At("HEAD"), cancellable = true, require = 0, remap = false)
    private static void verity$onCanDropItem(Item item, CallbackInfoReturnable<Boolean> cir) {
        if (VerityModFlags.DROP_ITEM_LEGACY_MODE) {
            cir.setReturnValue(true);
        }
    }

    @Inject(method = "entitySpawnEvent", at = @At("HEAD"), cancellable = true, require = 0, remap = false)
    private static void verity$onEntitySpawnHead(EntityJoinLevelEvent event, CallbackInfo ci) {
        if (VerityModFlags.FRIENDLY_MODE) {
            Entity entity = event.getEntity();
            try {
                Class<?> verityEntityClass = Class.forName("varmite.verity.entity.custom.VerityEntity");
                if (!verityEntityClass.isInstance(entity)) {
                    ci.cancel();
                }
            } catch (Throwable t) {
                // 反射失败：不拦截
            }
        }
    }
}
