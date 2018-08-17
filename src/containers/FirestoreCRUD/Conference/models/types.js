let createdAt = new Date().getTime();
const typeData = JSON.parse(
  `[{
  "id": "1",
  "title": "Development"
}, {
  "id": "2",
  "title": "Business"  
}, {
  "id": "3",
  "title": "Design" 
}, {
  "id": "4",
  "title": "Marketing"
}, {
  "id": "5",
  "title": "Lifestyle"
}]`
);
const sortingOption = {};
class fakeData {
  constructor(size) {
    this.size = size || 2000;
    this.datas = [];
    this.sortKey = null;
    this.sortDir = null;
  }
  dataModel(index) {
    return typeData[index];
  }
  getObjectAt(index) {
    if (index < 0 || index > this.size) {
      return undefined;
    }
    if (this.datas[index] === undefined) {
      this.datas[index] = this.dataModel(index);
    }
    return this.datas[index];
  }
  getAll() {
    if (this.datas.length < this.size) {
      for (let i = 0; i < this.size; i++) {
        this.getObjectAt(i);
      }
    }
    return this.datas.slice();
  }

  getSize() {
    return this.size;
  }
  getSortAsc(sortKey) {
    sortingOption.sortKey = sortKey;
    sortingOption.sortDir = 'ASC';
    return this.datas.sort(this.sort);
  }
  getSortDesc(sortKey) {
    sortingOption.sortKey = sortKey;
    sortingOption.sortDir = 'DESC';
    return this.datas.sort(this.sort);
  }
  sort(optionA, optionB) {
    const valueA = optionA[sortingOption.sortKey].toUpperCase();
    const valueB = optionB[sortingOption.sortKey].toUpperCase();
    let sortVal = 0;
    if (valueA > valueB) {
      sortVal = 1;
    }
    if (valueA < valueB) {
      sortVal = -1;
    }
    if (sortVal !== 0 && sortingOption.sortDir === 'DESC') {
      return sortVal * (-1);
    }
    return sortVal;
  }
}
export default fakeData;
