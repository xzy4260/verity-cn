package varmite.verity.gui;

import me.shedaniel.clothconfig2.api.AbstractConfigListEntry;
import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.client.gui.components.Button;
import net.minecraft.client.gui.components.events.GuiEventListener;
import net.minecraft.client.gui.narration.NarratableEntry;
import net.minecraft.client.gui.narration.NarrationElementOutput;
import net.minecraft.network.chat.Component;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * 自定义按钮 Entry（用于 Cloth Config 配置界面中的可点击按钮）。
 *
 * 点击立即执行操作，不等保存。
 * 用于 Verity Mod 账户操作（OAuth 登录、刷新信息、连通性检测、退出登录）。
 */
public class ButtonEntry extends AbstractConfigListEntry<Object> {

    private final Component buttonLabel;
    private final Runnable onClick;
    private Button button;
    private final int buttonWidth;

    public ButtonEntry(Component fieldName, Component buttonLabel, int buttonWidth, Runnable onClick) {
        super(fieldName, false);
        this.buttonLabel = buttonLabel;
        this.onClick = onClick;
        this.buttonWidth = buttonWidth;
    }

    private Button getButton(int x, int y, int width) {
        if (button == null) {
            button = Button.builder(buttonLabel, b -> {
                try { onClick.run(); } catch (Throwable ignored) {}
            }).bounds(x, y, width, 20).build();
        } else {
            // 更新位置和宽度
            button.setX(x);
            button.setY(y);
            button.setWidth(width);
        }
        return button;
    }

    @Override
    public void render(GuiGraphics graphics, int index, int y, int x, int entryWidth, int entryHeight, int mouseX, int mouseY, boolean isHovered, float delta) {
        // 绘制字段名（左侧）
        Component name = getFieldName();
        graphics.drawString(Minecraft.getInstance().font, name, x, y + 6, 0xFFFFFFFF, false);

        // 渲染按钮（右侧）
        int actualButtonWidth = Math.min(buttonWidth, entryWidth - Minecraft.getInstance().font.width(name) - 16);
        if (actualButtonWidth < 60) actualButtonWidth = Math.min(buttonWidth, entryWidth);
        int btnX = x + entryWidth - actualButtonWidth;
        Button btn = getButton(btnX, y, actualButtonWidth);
        btn.render(graphics, mouseX, mouseY, delta);
    }

    @Override
    public boolean mouseClicked(double mouseX, double mouseY, int button) {
        if (this.button != null && this.button.mouseClicked(mouseX, mouseY, button)) {
            return true;
        }
        return false;
    }

    @Override
    public boolean mouseReleased(double mouseX, double mouseY, int button) {
        if (this.button != null && this.button.mouseReleased(mouseX, mouseY, button)) {
            return true;
        }
        return false;
    }

    @Override
    public List<? extends GuiEventListener> children() {
        if (button == null) return Collections.emptyList();
        return Collections.singletonList(button);
    }

    @Override
    public List<? extends NarratableEntry> narratables() {
        if (button == null) return Collections.emptyList();
        return Collections.singletonList(button);
    }

    @Override
    public void setFocused(GuiEventListener listener) {
    }

    @Override
    public GuiEventListener getFocused() {
        return button;
    }

    @Override
    public void setDragging(boolean dragging) {
    }

    @Override
    public boolean isDragging() {
        return false;
    }

    @Override
    public NarratableEntry.NarrationPriority narrationPriority() {
        return NarratableEntry.NarrationPriority.NONE;
    }

    @Override
    public void updateNarration(NarrationElementOutput narrationElementOutput) {
    }

    @Override
    public boolean isRequiresRestart() {
        return false;
    }

    @Override
    public void setRequiresRestart(boolean requiresRestart) {
    }

    @Override
    public Optional<Object> getDefaultValue() {
        return Optional.empty();
    }

    @Override
    public Object getValue() {
        return null;
    }

    @Override
    public Optional<Component> getError() {
        return Optional.empty();
    }

    @Override
    public int getItemHeight() {
        return 24;
    }

    @Override
    public void save() {
        // 按钮不需要保存
    }

    @Override
    public boolean isEdited() {
        return false;
    }
}
