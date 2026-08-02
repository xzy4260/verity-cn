package varmite.verity.mixin;

import net.minecraft.world.entity.player.Player;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

import java.lang.reflect.Field;
import java.lang.reflect.Method;

import varmite.verity.VerityModFlags;

/**
 * 拦截 VerityEntity：
 * 1. transformIntoDemon - 友好模式 ON 时返回 false，阻止恶魔变身
 * 2. aiStep (m_8119_) - 友好模式 ON 时设置标记，阻止杀生物和变身逻辑
 */
@Mixin(targets = "varmite.verity.entity.custom.VerityEntity", remap = false)
public class VerityEntityMixin {

    static {
        System.out.println("[VerityMixin] VerityEntityMixin LOADED (target=VerityEntity)");
    }

    @Inject(method = "transformIntoDemon", at = @At("HEAD"), cancellable = true, require = 0, remap = false)
    private void verity$onTransformIntoDemon(Player player, CallbackInfoReturnable<Boolean> cir) {
        if (VerityModFlags.FRIENDLY_MODE) {
            System.out.println("[VerityMixin] BLOCKING demon transform (friendly mode ON)");
            cir.setReturnValue(false);
        }
    }

    @Inject(method = "m_8119_", at = @At("HEAD"), remap = false)
    private void verity$onAiStepHead(CallbackInfo ci) {
        if (VerityModFlags.FRIENDLY_MODE) {
            verity$markDemonSpawned();
        }
    }

    private void verity$markDemonSpawned() {
        try {
            Class<?> verityEntityClass = Class.forName("varmite.verity.entity.custom.VerityEntity");

            // hasTriggeredDay2 = true
            Field f3 = verityEntityClass.getDeclaredField("hasTriggeredDay2");
            f3.setAccessible(true);
            f3.setBoolean(this, true);

            // 获取 level
            Method getLevel = verityEntityClass.getMethod("m_9236_");
            Object level = getLevel.invoke(this);

            // WorldSpawnData.get(ServerLevel)
            Class<?> worldSpawnDataClass = Class.forName("varmite.verity.event.WorldSpawnData");
            Class<?> serverLevelClass = Class.forName("net.minecraft.server.level.ServerLevel");
            Method getMethod = worldSpawnDataClass.getMethod("get", serverLevelClass);
            Object worldSpawnData = getMethod.invoke(null, level);

            // hasSpawnedDemon = true
            Field f1 = worldSpawnDataClass.getDeclaredField("hasSpawnedDemon");
            f1.setAccessible(true);
            f1.setBoolean(worldSpawnData, true);

            // hasSpawnedDemonAngered = true
            Field f2 = worldSpawnDataClass.getDeclaredField("hasSpawnedDemonAngered");
            f2.setAccessible(true);
            f2.setBoolean(worldSpawnData, true);

        } catch (Throwable t) {
            System.err.println("[VerityMixin] markDemonSpawned FAILED: " + t.getClass().getName() + ": " + t.getMessage());
        }
    }
}
