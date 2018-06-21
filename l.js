var lockFile = require('lockfile')


lockFile.check('fff.fff', (error, isLocked) => {
    console.log(isLocked? 'locked' : 'unlocked')
    // isLocked will be true if 'some/file' is locked, false otherwise
  });

// opts is optional, and defaults to {}
lockFile.lock('fff.fff', er => {
  // if the er happens, then it failed to acquire a lock.
  // if there was not an error, then the file was created,
  // and won't be deleted until we unlock it.
  console.log(er)
  console.log('test2')
  // do my stuff, free of interruptions
  // then, some time later, do:
  lockFile.unlock('fff.fff', er => {
    // er means that an error happened, and is probably bad.
  })
})



// lockfile.lock('fff.fff')
//   .then((release) => {
//     // Do something while the file is locked
//
//     console.log('test2')
//
//     // Call the provided release function when you're done,
//     // which will also return a promise
//     // return release();
//   });

console.log('test1')