export default classOrFunction => {
  return (
    typeof classOrFunction === 'function' &&
    classOrFunction.prototype.isComponent &&
    classOrFunction.parseTemplatePropRec &&
    classOrFunction.parseTemplate
  )
}
