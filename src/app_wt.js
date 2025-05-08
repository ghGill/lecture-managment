const { Worker, isMainThread, parentPort } = require('worker_threads');

// ================== BASE QUESTION ========================

class baseThreadQuestion {
  constructor(id) {
    this.id = id;
    this.timeId = 'Timer Question ' + id;
  }

  createWorker(task) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename);
      worker.postMessage(task);

      worker.on('message', (result) => {
        resolve(result);
      });

      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }

  getProcessTimerId(processType) {
    this.processTimerId = `${this.timeId} - ${processType}`;

    return this.processTimerId;
  }

  async sequentailProcess() {
    console.log(`Start sequentail process - question ${this.id}`);
    console.time(this.getProcessTimerId('Sequential'));
    await this.sequentialTasks();
    console.timeEnd(this.processTimerId);
  }

  async sequentialTasks() {
  }

  async paralellProcess() {
    console.log(`Start paralell process - question ${this.id}`);
    console.time(this.getProcessTimerId('Paralell'));
    await this.paralellTasks();
  }

  async paralellTasks() {
  }

  async start() {
    // In short: if (main) { start everything } else { be a worker }
    //parentPort is the connection between the main thread and the worker.
    //It allows:
    //Main thread to send messages to the worker.
    //Worker thread to send results back to the main thread.

    // -------- Main and Worker Logic --------
    if (isMainThread) {
      await this.sequentailProcess();
      console.log("=============================================");
      await this.paralellProcess();
    }
    else {
      parentPort.once('message', async (task) => {
        const result = await this.workerTask(task);
        parentPort.postMessage(result);
      });
    }
  }

  async workerTask(task) {
    return '';
  }
}

// ================= QUESTION 1 ============================

class threadQuestion1 extends baseThreadQuestion {
  constructor() {
    super(1);
    this.max_times = 100_000_000;
  }

  calculateSum(task) {
    let sum = 0;
    if (task === 'sum1') {
      for (let i = 1; i <= this.max_times; i++) {
        sum += i;
      }
    } else if (task === 'sum2') {
      for (let i = 1; i <= this.max_times; i++) {
        sum += i * 2;
      }
    }
    return `Calculated sum : ${sum}`;
  }

  async sequentialTasks() {
    console.log(await this.calculateSum('sum1'));
    console.log(await this.calculateSum('sum2'));
  }

  paralellTasks() {
    Promise.all([this.createWorker('sum1'), this.createWorker('sum2')])
      .then((results) => {
        console.timeEnd(this.processTimerId);
        console.log(results);
      })
      .catch((err) => {
        console.error('Worker error:', err);
      });
  }

  workerTask(task) {
    return this.calculateSum(task);
  }
}

// ================= QUESTION 2 ============================

class threadQuestion2 extends baseThreadQuestion {
  constructor() {
    super(2);
  }

  async sleep(n) {
    return new Promise(async (resolve, reject) => {
      setTimeout(() => {
        resolve(`Sleep for ${n} seconds`);
      }, n * 1000)
    })
  }

  async sequentialTasks() {
    console.log(await this.sleep(2));
    console.log(await this.sleep(2));
  }

  async paralellTasks() {
    Promise.all([this.createWorker(2), this.createWorker(2)])
      .then((results) => {
        console.timeEnd(this.processTimerId);
        console.log(results);
      })
      .catch((err) => {
        console.error('Worker error:', err);
      });
  }

  async workerTask(task) {
    return await this.sleep(task);
  }
}

// ================= QUESTION 3 ============================

class threadQuestion3 extends baseThreadQuestion {
  constructor() {
    super(3);
    this.RANDOM_ARR_LEN = 1000000;
    this.randomArr = [];
  }

  async generateRandomArray() {
    for (let i = 0; i < this.RANDOM_ARR_LEN; i++)
      this.randomArr.push(Math.floor(Math.random() * 100));
  
    return `Generated array length: ${this.randomArr.length}`;
  }
  
  async sortArr() {
    this.randomArr.sort();
  
    return `Sorted array length: ${this.randomArr.length}`;
  }
  
  async sequentialTasks() {
    console.log(await this.generateRandomArray());
    console.log(await this.sortArr());
  }

  async paralellTasks() {
    Promise.all([this.createWorker(1), this.createWorker(2)])
      .then((results) => {
        console.timeEnd(this.processTimerId);
        console.log(results);
      })
      .catch((err) => {
        console.error('Worker error:', err);
      });
  }

  async workerTask(task) {
    if (task == 1)
      return this.generateRandomArray();
    else
      return this.sortArr()
  }
}

// ================= QUESTION 4 ============================

class threadQuestion4 extends baseThreadQuestion {
  constructor() {
    super(4);
  }

  async isPrimeNumber(n) {
    for (let p = 2; p <= Math.floor(n / 2); p++) {
      if ((n / p) == Math.floor(n / p))
        return false;
    }
  
    return true;
  }
  
  async findAllPrimeNumbers(from, to) {
    let primeNumbers = [];
  
    for (let n = from; n <= to; n++) {
      if (await this.isPrimeNumber(n))
        primeNumbers.push(n);
    }
  
    return `found ${primeNumbers.length} prime numbers in range ${from} - ${to}`;
  }

  async sequentialTasks() {
    console.log(await this.findAllPrimeNumbers(1, 50000));
    console.log(await this.findAllPrimeNumbers(50001, 100000));
  }

  async paralellTasks() {
    Promise.all([this.createWorker([1, 50000]), this.createWorker([50001, 100000])])
    .then((results) => {
      console.timeEnd(this.processTimerId);
      console.log(results);
    })
    .catch((err) => {
      console.error('Worker error:', err);
    });
  }

  async workerTask(task) {
    return await this.findAllPrimeNumbers(task[0], task[1]);
  }
}

// ================= QUESTION 5 ============================
class threadQuestion5 extends baseThreadQuestion {
  constructor() {
    super(5);
    this.STR_REPEAT_TIMES = 1000000;
    this.longStr = '';
  }

  async createLongString(strLen) {
    let str = '';
  
    for (let i = 0; i < strLen; i++)
      str += 'abc';
  
    let revStr = await this.reverseString(str);
  
    return `Reversed string length is ${revStr.length}`;
  }
  
  async reverseString(str) {
    let revStr = '';

    for (let i = str.length - 1; i >= 0; i--)
      revStr += str[i];

    return revStr;
  }

  async sequentialTasks() {
    console.log(await this.createLongString(this.STR_REPEAT_TIMES));
  }

  async paralellTasks() {
    Promise.all([this.createWorker([1, 50000]), this.createWorker([50001, 100000])])
    .then((results) => {
      console.timeEnd(this.processTimerId);
      console.log(results);
    })
    .catch((err) => {
      console.error('Worker error:', err);
    });
  }

  async workerTask(task) {
    return await this.createLongString(this.STR_REPEAT_TIMES / 2);
  }
}

// ================================================

const q = new threadQuestion2();
q.start();

