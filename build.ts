import { build, rolldown } from 'rolldown';
import * as filters from './lib/filters.ts';

const SRC = import.meta.dir + '/src/';
const OUTPUT_DIR = import.meta.dir + '/.out/';
const BUNDLED_DIR = OUTPUT_DIR + 'bundled/';
const TSCONFIG = import.meta.dir + '/tsconfig.json';

const fileNames = Array.from(
  new Bun.Glob('**/*.case.ts').scanSync(SRC)
)
  .map((path) => path.slice(0, -'.case.ts'.length))
  .filter(filters.includeName);

const buildOutput = await Promise.all(
  fileNames.map(async (caseName, i) => {
    try {
      const input = await rolldown({
        input: SRC + caseName + '.case.ts',
        resolve: {
          tsconfigFilename: TSCONFIG,
        },
        logLevel: 'silent',
      });

      const outputPath = BUNDLED_DIR + i + '.js';
      await input.write({
        inlineDynamicImports: true,
        file: outputPath,
        minify: {
          compress: false,
          removeWhitespace: true,
          mangle: true,
        },
        banner: '// @bun',
      });

      return [
        caseName, 
        outputPath
      ]
    } catch (e) {
      console.log(e);
    }
  })
);

await Bun.write(
  OUTPUT_DIR + '_.json',
  JSON.stringify(Object.fromEntries(buildOutput.filter((o) => o != null)), null, 2)
);
