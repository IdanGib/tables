import { Component, OnInit } from '@angular/core';
interface Cell {
  val: string;
  tag?: string;
  mark?: boolean;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  tableStates: Array<string> = [];
  title = 'tables';
  lock = true;
  table: Array<Array<Cell>> = null;
  autoSave = null;
  ngOnInit(): void {
    const sTable = localStorage.getItem('table');
    this.table = JSON.parse(sTable || null);
    this.startAutoSave();
  }
  startAutoSave() {
    this.autoSave = setInterval(() => {
      const sTable = localStorage.getItem('table');
      if(sTable !== JSON.stringify(this.table || null)) {
        this.save();
      }
    }, 200);
  }

  undo() {
    this.table = this.getLastState() ?? this.table;
     
  }
  stopAutoSave() {
    if(this.autoSave) {
      clearInterval(this.autoSave);
    }
  }

  removeCol(c: number) {
    console.log('remove col ', c);
    for(const r of this.table) {
      r.splice(c, 1);
    }
  }
  addRow() {
    if(!this.table) {
      this.table = [];
    }
    this.table.push([{ val: '' }]);
    const cols = this.table[0].length;
    while(this.table[this.table.length - 1].length < cols) {
      this.table[this.table.length - 1].push({ val: '' });
    }
  }
  addCol() {
    if(!this.table) {
      this.table = [];
    }
    for(const row of this.table) {
      row.push({ val: '' });
    }
  }

  saveTableState(sTable: string) {
    if(this.tableStates.length > 50) {
        this.tableStates = [];
    }
    this.tableStates.push(sTable);
    console.log('save state');
  }

  copy(el: HTMLTextAreaElement) {
    if(el) {
      el.value = localStorage.getItem('table');
      el.select();
      document.execCommand("copy");
      alert('table copied!');;
    }

  }

  getLastState() {
    const last = this.tableStates.pop();
    if(last) {
      return JSON.parse(last);
    }
    return null;
  }
  apply(val: string, el: HTMLInputElement) {
    try {
      this.table = JSON.parse(val);
      el.value = '';
    } catch(e) {
      alert(e.message);
    }
 
  }
  findText(val: string) {
    let s1 = '', s2 = '';
    for(const r of this.table) {
      for(const c of r) {
        s1 = c.val.toLocaleLowerCase();
        s2 = val.toLocaleLowerCase();
        c['mark'] = s1.includes(s2);
      }
    }
  }
  save() {
    const sTable = JSON.stringify(this.table || null);
    localStorage.setItem('table', sTable);
    console.log('save!');
  }
}
