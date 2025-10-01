import { do_not_optimize } from 'mitata';
import { tag, attr } from 'tplm';

// Optimization viewer exports
export const main = () => {
  do_not_optimize(
    tag.html(attr.lang('en'),
      tag.body('', tag.p('', 'Hi'))   
    )
  );
}

export const viewOptimizations = {
  'main handler': main
};