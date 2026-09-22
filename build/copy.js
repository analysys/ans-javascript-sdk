import path from 'path';
import util from 'util';
import fs from 'fs-extra';
import isObject from 'is-plain-object';
import globby from 'globby';
import { green, bold, yellow } from 'colorette';

function stringify(value) {
  return util.inspect(value, {
    breakLength: Infinity
  });
}

async function isFile(filePath) {
  const fileStats = await fs.stat(filePath);
  return fileStats.isFile();
}

function renameTarget(target, rename, src) {
  const parsedPath = path.parse(target);
  return typeof rename === 'string' ? rename : rename(parsedPath.name, parsedPath.ext.replace('.', ''), src);
}

async function generateCopyTarget(src, dest, {
  flatten,
  rename,
  transform
}) {
  if (transform && !(await isFile(src))) {
    throw new Error(`"transform" option works only on files: '${src}' must be a file`);
  }

  const {
    base,
    dir
  } = path.parse(src);
  const destinationFolder = flatten || !flatten && !dir ? dest : dir.replace(dir.split('/')[0], dest);
  return {
    src,
    dest: path.join(destinationFolder, rename ? renameTarget(base, rename, src) : base),
    ...(transform && {
      contents: await transform(await fs.readFile(src), base)
    }),
    renamed: rename,
    transformed: transform
  };
}

function copy(options = {}) {
  const {
    copyOnce = false,
    flatten = true,
    hook = 'buildEnd',
    targets = [],
    verbose = false,
    ...restPluginOptions
  } = options;
  let copied = false;
  return {
    name: 'copy',
    [hook]: async () => {
      if (copyOnce && copied) {
        return;
      }

      setTimeout(async () => {

      

      const copyTargets = [];

      if (Array.isArray(targets) && targets.length) {
        for (const target of targets) {
          if (!isObject(target)) {
            throw new Error(`${stringify(target)} target must be an object`);
          }

          const {
            dest,
            rename,
            src,
            transform,
            ...restTargetOptions
          } = target;

          if (!src || !dest) {
            throw new Error(`${stringify(target)} target must have "src" and "dest" properties`);
          }

          if (rename && typeof rename !== 'string' && typeof rename !== 'function') {
            throw new Error(`${stringify(target)} target's "rename" property must be a string or a function`);
          }

          const matchedPaths = await globby(src, {
            expandDirectories: false,
            onlyFiles: false,
            ...restPluginOptions,
            ...restTargetOptions
          });

          if (matchedPaths.length) {
            for (const matchedPath of matchedPaths) {
              const generatedCopyTargets = Array.isArray(dest) ? await Promise.all(dest.map(destination => generateCopyTarget(matchedPath, destination, {
                flatten,
                rename,
                transform
              }))) : [await generateCopyTarget(matchedPath, dest, {
                flatten,
                rename,
                transform
              })];
              copyTargets.push(...generatedCopyTargets);
            }
          }
        }
      }

      if (copyTargets.length) {
        if (verbose) {
          console.log(green('copied:'));
        }

        for (const copyTarget of copyTargets) {
          const {
            contents,
            dest,
            src,
            transformed
          } = copyTarget;

          if (transformed) {
            try {
              // 先删除目标文件，避免权限问题
              if (await fs.pathExists(dest)) {
                try {
                  await fs.remove(dest);
                } catch (removeError) {
                  console.warn(`Failed to remove file ${dest}: ${removeError.message}`);
                }
              }
              // 使用 fs.outputFile 写入文件，它会自动创建目录
              await fs.outputFile(dest, contents, { ...restPluginOptions, overwrite: true });
            } catch (error) {
              console.warn(`Failed to write file ${dest}: ${error.message}`);
            }
          } else {
            try {
              // 检查 src 是否为目录
              const srcStats = await fs.stat(src);
              if (srcStats.isDirectory()) {
                // 对于目录，先确保目标目录存在
                await fs.ensureDir(dest);
                // 递归复制目录内容
                const files = await fs.readdir(src);
                for (const file of files) {
                  const srcPath = path.join(src, file);
                  const destPath = path.join(dest, file);
                  try {
                    const fileStats = await fs.stat(srcPath);
                    if (fileStats.isFile()) {
                      // 复制文件
                      if (await fs.pathExists(destPath)) {
                        try {
                          await fs.remove(destPath);
                        } catch (removeError) {
                          console.warn(`Failed to remove file ${destPath}: ${removeError.message}`);
                        }
                      }
                      // 直接使用 fs.writeFile 写入文件内容，避免 chmod 权限问题
                      const fileContent = await fs.readFile(srcPath);
                      await fs.writeFile(destPath, fileContent);
                    } else if (fileStats.isDirectory()) {
                      // 递归复制子目录
                      await fs.ensureDir(destPath);
                      const subFiles = await fs.readdir(srcPath);
                      for (const subFile of subFiles) {
                        const subSrcPath = path.join(srcPath, subFile);
                        const subDestPath = path.join(destPath, subFile);
                        const subFileStats = await fs.stat(subSrcPath);
                        if (subFileStats.isFile()) {
                          if (await fs.pathExists(subDestPath)) {
                            try {
                              await fs.remove(subDestPath);
                            } catch (removeError) {
                              console.warn(`Failed to remove file ${subDestPath}: ${removeError.message}`);
                            }
                          }
                          const subFileContent = await fs.readFile(subSrcPath);
                          await fs.writeFile(subDestPath, subFileContent);
                        }
                      }
                    }
                  } catch (fileError) {
                    console.warn(`Failed to process file ${srcPath}: ${fileError.message}`);
                  }
                }
              } else {
                // 对于文件，先删除目标文件，避免权限问题
                if (await fs.pathExists(dest)) {
                  try {
                    await fs.remove(dest);
                  } catch (removeError) {
                    console.warn(`Failed to remove file ${dest}: ${removeError.message}`);
                  }
                }
                // 直接使用 fs.writeFile 写入文件内容，避免 chmod 权限问题
                const fileContent = await fs.readFile(src);
                await fs.writeFile(dest, fileContent);
              }
            } catch (error) {
              console.warn(`Failed to copy ${src} to ${dest}: ${error.message}`);
            }
          }

          if (verbose) {
            let message = green(`  ${bold(src)} → ${bold(dest)}`);
            const flags = Object.entries(copyTarget).filter(([key, value]) => ['renamed', 'transformed'].includes(key) && value).map(([key]) => key.charAt(0).toUpperCase());

            if (flags.length) {
              message = `${message} ${yellow(`[${flags.join(', ')}]`)}`;
            }

            console.log(message);
          }
        }
      } else if (verbose) {
        console.log(yellow('no items to copy'));
      }

      copied = true;
      })
    }
  };
}

export default copy;
