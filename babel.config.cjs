module.exports = function (api) {
  api.cache(true)

  // Babel plugin: rewrite import.meta.env → process.env for Jest (Node/CJS)
  function importMetaEnvToProcessEnv({ types: t }) {
    return {
      visitor: {
        MemberExpression(path) {
          if (
            t.isMetaProperty(path.node.object) &&
            path.node.object.meta.name === 'import' &&
            path.node.object.property.name === 'meta' &&
            t.isIdentifier(path.node.property, { name: 'env' })
          ) {
            path.replaceWith(
              t.memberExpression(t.identifier('process'), t.identifier('env'))
            )
          }
        },
      },
    }
  }

  return {
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }],
      ['@babel/preset-react', { runtime: 'automatic' }],
      '@babel/preset-typescript',
    ],
    plugins: [importMetaEnvToProcessEnv],
  }
}
