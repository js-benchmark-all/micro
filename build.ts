import { build } from 'rolldown';
import * as filters from './lib/filters.ts';

const SRC = import.meta.dir + '/src/';
const OUTPUT_DIR = import.meta.dir + '/.out/';
const BUNDLED_DIR = OUTPUT_DIR + 'bundled/';

const fileNames = Array.from(
  new Bun.Glob('**/*.case.ts').scanSync(SRC)
)
  .map((path) => path.slice(0, -'.case.ts'.length))
  .filter(filters.includeName);

const buildOutput = (
  await build({
    input: fileNames.map((name) => SRC + name + '.case.ts'),
    output: {
      dir: BUNDLED_DIR,
      banner: '// @bun',
      minify: {
        compress: false,
        removeWhitespace: true,
        mangle: true,
      },
    },
    logLevel: 'silent'
  })
).output
  .map((o) => {
    if (o.type !== 'chunk' || o.facadeModuleId == null) return;
    return [
      o.facadeModuleId.slice(SRC.length, -'.case.ts'.length),
      BUNDLED_DIR + o.fileName
    ];
  })
  .filter((o) => o != null);

await Bun.write(
  OUTPUT_DIR + '_.json',
  JSON.stringify(Object.fromEntries(buildOutput), null, 2)
);
