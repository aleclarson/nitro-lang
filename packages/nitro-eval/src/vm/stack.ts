// TODO: finish the call stack

// TODO: move this to shared types
type SourceLocation = [SourceFile, number, number]
interface SourceFile {
  path: string
}

type CallStack = CallSite[]

interface CallSite {
  scope: Scope
  loc: SourceLocation
}

interface Scope {
  this?: Value
  locals: Value[]
  parent?: Scope
}

interface Value {
  type: Type
}

interface Record extends Value {
  props: { [prop: string]: any }
}

interface Type {
  name: string
}
