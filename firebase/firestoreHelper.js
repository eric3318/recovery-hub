import { database, storage } from './firebaseSetup';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';

export const COLLECTIONS = {
  USER: 'users',
  POST: 'posts',
  APPOINTMENT: 'appointments',
};

export async function writeToDB(data, collectionName, id = null) {
  try {
    if (id) {
      await updateDoc(doc(database, collectionName, id), data);
    } else {
      await addDoc(collection(database, collectionName), data);
    }
  } catch (err) {
    console.log(err);
  }
}

export async function writeToDBV2(data, collectionName, id = null) {
  try {
    if (id) {
      await setDoc(doc(database, collectionName, id), data);
    } else {
      await addDoc(collection(database, collectionName), data);
    }
  } catch (err) {
    console.log(err);
  }
}

export async function readFromStorage(path) {
  try {
    return await getDownloadURL(ref(storage, path));
  } catch (err) {
    console.log(err);
  }
}

export async function updateDB(data, collectionName, id) {
  try {
    await updateDoc(doc(database, collectionName, id), data);
  } catch (err) {
    console.log(err);
  }
}

export async function deleteFromDB(id, collectionName) {
  try {
    await deleteDoc(doc(database, collectionName, id));
  } catch (err) {
    console.log(err);
  }
}

export async function readFromDB(id, collectionName) {
  try {
    const document = await getDoc(doc(database, collectionName, id));
    if (!document.exists()) {
      throw new Error('The document requested does not exist in database');
    }
    return document.data();
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getBookedTimeslots(trainerId, date) {
  try {
    const trainerRef = doc(database, 'Trainer', trainerId);
    const trainerDoc = await getDoc(trainerRef);
    if (trainerDoc.exists()) {
      const bookedTimeslots = trainerDoc.data().bookedTimeslots || {};
      return bookedTimeslots[date] || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching booked timeslots:', error);
    return [];
  }
}

export async function getAllBookedTimeslots(trainerId) {
  try {
    const trainerRef = doc(database, 'Trainer', trainerId);
    const trainerDoc = await getDoc(trainerRef);
    if (trainerDoc.exists()) {
      return trainerDoc.data().bookedTimeslots || {};
    }
    return {};
  } catch (error) {
    console.error('Error fetching all booked timeslots:', error);
    return {};
  }
}

export async function addBookedTimeslot(trainerId, date, time) {
  try {
    const trainerRef = doc(database, 'Trainer', trainerId);
    await updateDoc(trainerRef, {
      [`bookedTimeslots.${date}`]: arrayUnion(time),
    });
  } catch (error) {
    console.error('Error adding booked timeslot:', error);
  }
}

export async function addAppointment(user, trainerId, trainerName, datetime) {
  try {
    await addDoc(collection(database, 'Appointments'), {
      user,
      trainerId,
      trainerName,
      datetime,
    });
  } catch (error) {
    console.error('Error adding appointment:', error);
  }
}

export async function cancelAppointment(appointmentId, trainerId, date, time) {
  try {
    const trainerRef = doc(database, 'Trainer', trainerId);

    await updateDoc(trainerRef, {
      [`bookedTimeslots.${date}`]: arrayRemove(time),
    });

    const appointmentRef = doc(database, 'Appointments', appointmentId);
    await deleteDoc(appointmentRef);
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    throw error;
  }
}

// export async function deleteAllFromDB(collectionName) {
//   try {
//     const querySnapshot = await getDocs(collection(database, collectionName));
//     querySnapshot.forEach((docSnapshot) => {
//       deleteFromDB(docSnapshot.id, collectionName);
//     });
//   } catch (err) {
//     console.log(err);
//   }
// }

// export async function readAll(collectionName) {
//   try {
//     const querySnapshot = await getDocs(collection(database, collectionName));
//     let newArray = [];
//     if (!querySnapshot.empty) {
//       querySnapshot.forEach((docSnapshot) => newArray.push(docSnapshot.data()));
//     }
//     return newArray;
//   } catch (err) {
//     console.log(err);
//   }
// }
