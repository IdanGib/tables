import { Component, OnInit } from '@angular/core';
interface Cell {
  val: string;
  tag?: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'tables';
  lock = false;
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
        console.log('save!');
      }
    }, 200);
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
  save() {
    const sTable = JSON.stringify(this.table || null);
    localStorage.setItem('table', sTable);
  }
}