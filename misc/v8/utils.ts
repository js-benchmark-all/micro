const REPO = 'v8/v8';
const TAG = '13.7.152.14';

(async () => {
  console.log('looking up tag', TAG, 'of repo', REPO);

  const tagResponse = await fetch(
    `https://api.github.com/repos/${REPO}/git/refs/tags/${TAG}`
  );
  if (!tagResponse.ok)
    throw new Error('Unknown tag: ' + TAG);
  const tagTree =  `https://github.com/${REPO}/tree/${(await tagResponse.json() as any).object.sha}`;

  console.log('optimization status file:', tagTree + '/test/mjsunit/mjsunit.js');
})();
