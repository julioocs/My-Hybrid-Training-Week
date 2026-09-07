const CDN='https://www.gstatic.com/firebasejs/12.2.1/';
let api=null,auth=null,db=null,user=null,unsubscribe=null;
export async function initFirebase(onUser){const cfg=window.IRONHYBRID_FIREBASE_CONFIG;if(!cfg)return {configured:false};const appM=await import(CDN+'firebase-app.js'),authM=await import(CDN+'firebase-auth.js'),fireM=await import(CDN+'firebase-firestore.js');const app=appM.initializeApp(cfg);auth=authM.getAuth(app);db=fireM.getFirestore(app);api={...authM,...fireM};api.onAuthStateChanged(auth,u=>{user=u;onUser(u)});return {configured:true}}
export async function signIn(email,password){return api.signInWithEmailAndPassword(auth,email,password)}
export async function signUp(email,password){return api.createUserWithEmailAndPassword(auth,email,password)}
export async function signOutUser(){return api.signOut(auth)}
export async function saveRemote(id,data){if(!user)return;await api.setDoc(api.doc(db,'users',user.uid,'workoutLogs',id),data,{merge:true})}
export function watchRemote(onData){if(!user)return;if(unsubscribe)unsubscribe();unsubscribe=api.onSnapshot(api.collection(db,'users',user.uid,'workoutLogs'),snap=>onData(snap.docs.map(d=>({id:d.id,...d.data()}))))}
export function currentUser(){return user}
