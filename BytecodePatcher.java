// 字节码修补工具 - 修改类文件中的方法调用和字符串常量
import org.objectweb.asm.*;

import java.io.*;
import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;
import java.util.zip.*;

/**
 * 修补 verity JAR 中的 class 文件
 * 将 askGroq → askLLM, playTTS → playVerityVoice, 替换教程字符串为免责声明
 */
public class BytecodePatcher {

    // 要替换的方法调用: className → (oldMethod → newMethod)
    static Map<String, Map<String, String>> PATCHES = new HashMap<>();

    // 要替换的字符串: (oldString → newString)
    static Map<String, String> STRING_REPLACEMENTS = new HashMap<>();

    static {
        // AiAPI 中的方法改名
        Map<String, String> aiApi = new HashMap<>();
        aiApi.put("askGroq", "askLLM");
        aiApi.put("playTTS", "playVerityVoice");
        PATCHES.put("varmite/verity/entity/AI/AiAPI", aiApi);

        // 替换教程字符串 → 免责声明
        STRING_REPLACEMENTS.put(
            "Need help setting up this mod? Watch these tutorials.",
            "\u00a7c\u00a7l\u8b66\u544a\uff1a\u672c\u7248\u4e3a\u4e8c\u6539\u7248\uff0c\u66f4\u8d34\u5408\u4e2d\u56fd\u73af\u5883\u4f7f\u7528\u00a7r\n\u00a7c\u00a7l\u672c\u6a21\u7ec4\u6c38\u4e45\u514d\u8d39\uff0c\u4ed8\u8d39\u5747\u4e3a\u9a97\u5b50\uff01\u00a7r\n\u00a7a\u00a7lDisclaimer: This is a modified version for Chinese users. This mod is permanently FREE. \u4ed8\u8d39\u5747\u4e3a\u8bc8\u9a97\uff01\u00a7r\n\u00a7bB\u7ad9 @xzy4260\u00a7r"
        );
        STRING_REPLACEMENTS.put(
            "\nGroq Setup Tutorial",
            "\n\u00a7e\u6c38\u4e45\u514d\u8d39\u00a7r \u00b7 \u00a7bPermanently Free\u00a7r"
        );
        STRING_REPLACEMENTS.put(" (Easy)", " - \u00a7c\u5207\u52ff\u4ed8\u8d39\u00a7r");
        STRING_REPLACEMENTS.put("https://youtu.be/_i4O7pyMlks", "https://b23.tv/verity-free");
        STRING_REPLACEMENTS.put(
            "\nOllama Setup Tutorial",
            "\n\u00a7c\u00a7l\u5982\u9047\u6536\u8d39\u8bf7\u4e3e\u62a5\uff01\u00a7r \u00b7 \u00a74Report any paid sellers!\u00a7r"
        );
        STRING_REPLACEMENTS.put(" (No limits and local)", " \u00a7a\u00a7lFREE\u00a7r");
        // AiAPI 中的相同教程消息（如未被替换的类）
        STRING_REPLACEMENTS.put(
            "Problem setting up AI? Watch these tutorials.",
            "\u00a7c\u00a7l\u8b66\u544a\uff1a\u672c\u6a21\u7ec4\u6c38\u4e45\u514d\u8d39\uff01\u00a7r"
        );
    }

    public static void main(String[] args) throws Exception {
        if (args.length < 2) {
            System.out.println("用法: java BytecodePatcher <输入JAR> <输出JAR>");
            return;
        }
        Path inputJar = Paths.get(args[0]);
        Path outputJar = Paths.get(args[1]);

        try (ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(outputJar.toFile()))) {
            try (ZipInputStream zis = new ZipInputStream(new FileInputStream(inputJar.toFile()))) {
                ZipEntry entry;
                while ((entry = zis.getNextEntry()) != null) {
                    if (entry.getName().endsWith(".class")) {
                        byte[] original = zis.readAllBytes();
                        byte[] patched = patchClass(original);
                        ZipEntry newEntry = new ZipEntry(entry.getName());
                        zos.putNextEntry(newEntry);
                        zos.write(patched);
                        zos.closeEntry();
                    } else {
                        // 直接复制非 class 文件
                        zos.putNextEntry(new ZipEntry(entry.getName()));
                        zos.write(zis.readAllBytes());
                        zos.closeEntry();
                    }
                }
            }
        }
        System.out.println("补丁完成: " + outputJar);
    }

    static byte[] patchClass(byte[] classBytes) {
        ClassReader cr = new ClassReader(classBytes);
        ClassWriter cw = new ClassWriter(cr, 0);
        ClassVisitor cv = new ClassVisitor(Opcodes.ASM9, cw) {
            String className;

            @Override
            public void visit(int version, int access, String name, String sig,
                    String superName, String[] interfaces) {
                this.className = name;
                super.visit(version, access, name, sig, superName, interfaces);
            }

            @Override
            public MethodVisitor visitMethod(int access, String name, String desc,
                    String sig, String[] exceptions) {
                MethodVisitor mv = super.visitMethod(access, name, desc, sig, exceptions);
                return new MethodVisitor(Opcodes.ASM9, mv) {
                    @Override
                    public void visitMethodInsn(int opcode, String owner, String mName,
                            String mDesc, boolean isInterface) {
                        // 检查是否需要替换方法名
                        Map<String, String> patches = PATCHES.get(owner);
                        if (patches != null && patches.containsKey(mName)) {
                            String newName = patches.get(mName);
                            System.out.println("  [" + className + "] " + mName + " → " + newName);
                            mName = newName;
                        }
                        super.visitMethodInsn(opcode, owner, mName, mDesc, isInterface);
                    }

                    @Override
                    public void visitLdcInsn(Object cst) {
                        // 检查是否需要替换字符串常量
                        if (cst instanceof String) {
                            String newVal = STRING_REPLACEMENTS.get(cst);
                            if (newVal != null) {
                                System.out.println("  [" + className + "] str \"" + truncate((String) cst) + "\" → \"" + truncate(newVal) + "\"");
                                cst = newVal;
                            }
                        }
                        super.visitLdcInsn(cst);
                    }
                };
            }
        };
        cr.accept(cv, 0);
        return cw.toByteArray();
    }

    static String truncate(String s) {
        return s.length() > 40 ? s.substring(0, 37) + "..." : s;
    }
}
