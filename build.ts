import { build } from 'rolldown';
import * as filters from './lib/filters.ts';
import { fmt } from './lib/format.ts';

const SRC = import.meta.dir + '/src/';
const OUTPUT_DIR = import.meta.dir + '/.out/';
const BUNDLED_DIR = OUTPUT_DIR + 'bundled/';
const TSCONFIG = import.meta.dir + '/tsconfig.json';

const buildOutput = await Promise.all(
  Iterator.from(new Bun.Glob('**/*.case.ts').scanSync(SRC))
    .map((path) => path.slice(0, -'.case.ts'.length))
    .filter(filters.includeName)
    .map(async (caseName, i) => {
    try {
      const inputPath = SRC + caseName + '.case.ts';
      const outputPath = BUNDLED_DIR + i + '.js';

      await build({
        input: inputPath,
        tsconfig: TSCONFIG,
        logLevel: 'silent',
        output: {
          inlineDynamicImports: true,
          file: outputPath,
          minify: {
            compress: false,
            mangle: {
              toplevel: true
            },
            codegen: {
              removeWhitespace: true
            }
          },
          postBanner: '// @bun',
        }
      });

      console.log('Built', fmt.relativePath(inputPath), 'to', fmt.relativePath(outputPath));

      return [
        caseName,
        outputPath
      ]
    } catch (e) {
      console.error(e);
    }
  })
);

await Bun.write(
  OUTPUT_DIR + '_.json',
  JSON.stringify(Object.fromEntries(buildOutput.filter((o) => o != null)), null, 2)
);
