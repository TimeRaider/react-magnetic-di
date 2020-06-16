const { createMacro } = require('babel-plugin-macros');

const { PACKAGE_NAME, PACKAGE_FUNCTION } = require('./constants');
const processReference = require('./processor');
const { createNamedImport, isEnabledEnv } = require('./utils');

const diMacro = ({ references, babel, config = {} }) => {
  const { types: t } = babel;
  const isEnabled = isEnabledEnv() || Boolean(config.forceEnable);

  const defaultImport = references.default;
  if (!defaultImport || defaultImport.length === 0) return;
  // process all calls
  defaultImport.forEach((ref) => processReference(t, ref, isEnabled));

  // if not enabled let import to be stripped
  if (!isEnabled) return;

  // add named import
  const methodIdentifier = defaultImport[0].node;
  const statement = createNamedImport(
    t,
    PACKAGE_NAME,
    PACKAGE_FUNCTION,
    methodIdentifier
  );

  const programPath = defaultImport[0].scope.getProgramParent().path;

  const targetPath = programPath
    .get('body')
    .find(
      (p) =>
        p.node &&
        p.node.source &&
        p.node.source.value === PACKAGE_NAME + '/babel.macro'
    );

  if (targetPath) {
    // if we find the macro import, we add the clean import right before
    // should always be the case, but we handle exception
    targetPath.insertBefore(statement);
  } else {
    // we add the import at the top of the program body
    programPath.unshiftContainer('body', statement);
  }
};

module.exports = createMacro(diMacro, {
  configName: 'reactMagneticDi',
});