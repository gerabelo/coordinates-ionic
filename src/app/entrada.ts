export class Entrada {
    constructor (name: String, label: String, value: {id: String, icon:String}, type: String, checked: Boolean) {
        this.name = name;
        this.label = label;
        this.value = value;
        this.type = type;
        this.checked = checked;
    }
    
    name: String;
    label: String;
    value: {id: String, icon: String};
    type: String;
    checked: Boolean;
}
