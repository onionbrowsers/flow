
import flowfile from './flowfile'
import tag from './tag'
import editableTable from './editalbe-table'

function mount () {
  this.$store.registerModule('flowfile', flowfile)
  this.$store.registerModule('flowchartTags', tag)
  this.$store.registerModule('editableTable', editableTable)
}

export default {
  mount
}
