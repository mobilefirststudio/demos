/* ============================================================
   FITNESS PLANNER — Mobile First Studio
   ============================================================ */

/* ---------- DATE HELPERS (local time, no UTC-shift bugs) ---------- */
function today(){
  const d=new Date();
  const y=d.getFullYear();const m=String(d.getMonth()+1).padStart(2,'0');const day=String(d.getDate()).padStart(2,'0');
  return y+'-'+m+'-'+day;
}
function localDateStr(d){
  const y=d.getFullYear();const m=String(d.getMonth()+1).padStart(2,'0');const day=String(d.getDate()).padStart(2,'0');
  return y+'-'+m+'-'+day;
}
function parseLocalDate(s){
  const p=s.split('-');return new Date(+p[0],+p[1]-1,+p[2]);
}
function daysBetween(a,b){
  return Math.round((parseLocalDate(b)-parseLocalDate(a))/86400000);
}
function fmtDate(s){
  if(!s)return'';
  return parseLocalDate(s).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
}
function fmtDateShort(s){
  if(!s)return'';
  return parseLocalDate(s).toLocaleDateString('en-US',{month:'short',day:'numeric'});
}
function weekStartOf(dateStr){
  var d=parseLocalDate(dateStr);
  var dow=d.getDay();var diff=dow===0?-6:1-dow;
  d.setDate(d.getDate()+diff);
  return localDateStr(d);
}
function monthStartOf(dateStr){
  var d=parseLocalDate(dateStr);
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-01';
}
function lbsToKg(lbs){return lbs*0.45359237;}
function kgToLbs(kg){return kg/0.45359237;}
function cmToFtIn(cm){
  var totalIn=cm/2.54;
  var ft=Math.floor(totalIn/12);
  var inch=Math.round(totalIn%12);
  if(inch===12){ft+=1;inch=0;}
  return {ft:ft,in:inch};
}
function ftInToCm(ft,inch){return (ft*12+inch)*2.54;}

/* ---------- THEMES ---------- */
var THEMES={
  warmNeutrals:{
    name:'Natural Energy', tagline:'Aesthetic, planner-friendly', isDark:false,
    bg:'#EBDDBE', bg2:'#FBF5E9', bg3:'#DBC49B',
    text:'#241C14', text2:'#6B5A42', text3:'#9C8A6B',
    accent:'#A8562C', accent2:'#8B3F22', tint:'#F2E2C4',
    border:'#D8C39A', border2:'#E9DABA',
    gradA:'#C97A3D', gradB:'#8B3F22',
    swatches:['#EBDDBE','#DBC49B','#A8562C','#FBF5E9','#241C14']
  },
  electricEnergy:{
    name:'Electric Energy', tagline:'Bold, motivational', isDark:true,
    bg:'#0A0A14', bg2:'#15141F', bg3:'#1E1D2B',
    text:'#EDEDF5', text2:'#9C9AB0', text3:'#67647F',
    accent:'#3A7BFF', accent2:'#FF3E9E', tint:'#182042',
    border:'#2A2938', border2:'#211F2C',
    gradA:'#3A7BFF', gradB:'#FF3E9E',
    swatches:['#3A7BFF','#7B2FFF','#FF3E9E','#0A0A14','#EDEDF5']
  },
  healthyGreens:{
    name:'Clean Energy', tagline:'Wellness + nutrition vibe', isDark:false,
    bg:'#FBF7EE', bg2:'#FFFFFF', bg3:'#CFF0DC',
    text:'#16261C', text2:'#4E6B58', text3:'#87A392',
    accent:'#2ECC82', accent2:'#0F3D2E', tint:'#DFF6E7',
    border:'#CBEAD5', border2:'#E3F5E9',
    gradA:'#3ECF8E', gradB:'#0F3D2E',
    swatches:['#A8F5D1','#2ECC82','#0F3D2E','#FBF7EE','#16261C']
  },
  darkModeAccent:{
    name:'Pure Energy', tagline:'Professional fitness look', isDark:true,
    bg:'#000000', bg2:'#151515', bg3:'#202020',
    text:'#FFFFFF', text2:'#A6A6A6', text3:'#5C5C5C',
    accent:'#2F6FED', accent2:'#C8FF4A', tint:'#132244',
    border:'#262626', border2:'#1C1C1C',
    gradA:'#2F6FED', gradB:'#C8FF4A',
    swatches:['#000000','#151515','#2F6FED','#C8FF4A','#FFFFFF']
  }
};

/* ---------- BUILT-IN EXERCISE LIBRARY ---------- */
var BUILTIN_EXERCISES=[
  {name:'Barbell Bench Press',cat:'Chest'},{name:'Incline Dumbbell Press',cat:'Chest'},
  {name:'Push-Up',cat:'Chest'},{name:'Cable Fly',cat:'Chest'},{name:'Dumbbell Fly',cat:'Chest'},
  {name:'Deadlift',cat:'Back'},{name:'Pull-Up',cat:'Back'},{name:'Barbell Row',cat:'Back'},
  {name:'Lat Pulldown',cat:'Back'},{name:'Seated Cable Row',cat:'Back'},{name:'Dumbbell Row',cat:'Back'},
  {name:'Back Squat',cat:'Legs'},{name:'Front Squat',cat:'Legs'},{name:'Romanian Deadlift',cat:'Legs'},
  {name:'Leg Press',cat:'Legs'},{name:'Walking Lunge',cat:'Legs'},{name:'Bulgarian Split Squat',cat:'Legs'},
  {name:'Leg Curl',cat:'Legs'},{name:'Leg Extension',cat:'Legs'},{name:'Calf Raise',cat:'Legs'},
  {name:'Bodyweight Squat',cat:'Legs'},{name:'Glute Bridge',cat:'Legs'},{name:'Wall Sit',cat:'Legs'},{name:'Step-Up',cat:'Legs'},
  {name:'Overhead Press',cat:'Shoulders'},{name:'Dumbbell Shoulder Press',cat:'Shoulders'},
  {name:'Lateral Raise',cat:'Shoulders'},{name:'Face Pull',cat:'Shoulders'},{name:'Rear Delt Fly',cat:'Shoulders'},
  {name:'Barbell Curl',cat:'Arms'},{name:'Dumbbell Curl',cat:'Arms'},{name:'Hammer Curl',cat:'Arms'},
  {name:'Tricep Pushdown',cat:'Arms'},{name:'Skull Crusher',cat:'Arms'},{name:'Dips',cat:'Arms'},
  {name:'Plank',cat:'Core'},{name:'Hanging Leg Raise',cat:'Core'},{name:'Cable Crunch',cat:'Core'},
  {name:'Russian Twist',cat:'Core'},{name:'Ab Wheel Rollout',cat:'Core'},
  {name:'Bicycle Crunch',cat:'Core'},{name:'Superman',cat:'Core'},{name:'Bird Dog',cat:'Core'},
  {name:'Mountain Climbers',cat:'Core'},
  {name:'Running',cat:'Cardio'},{name:'Cycling',cat:'Cardio'},{name:'Rowing Machine',cat:'Cardio'},
  {name:'Jump Rope',cat:'Cardio'},{name:'Stair Climber',cat:'Cardio'},
  {name:'Walking',cat:'Cardio'},{name:'Jumping Jacks',cat:'Cardio'},{name:'High Knees',cat:'Cardio'},
  {name:'Burpees',cat:'Cardio'}
];

/* ---------- DATA / STORAGE ---------- */
function defaultProfile(){
  return {name:'',unit:'lbs',theme:'warmNeutrals',calGoal:2000,proteinGoal:150,waterGoal:8,
    calcSex:'female',calcAge:'',calcHeightCm:null,calcWeightKg:null,calcActivity:1.55,calcGoalType:'lose',calcRate:500,
    notif:{streak:true,completed:true,milestone:true,notLogged:true}};
}
var DB={
  profile:defaultProfile(),
  customExercises:[],
  routines:[],
  workouts:[],
  bodyweight:[],
  meals:[],
  water:[] // {date, count}
};

function sv(){
  localStorage.setItem('mfs_fitness_demo_v1',JSON.stringify(DB));
}
function ld(){
  try{
    const r=localStorage.getItem('mfs_fitness_demo_v1');
    if(r){
      const parsed=JSON.parse(r);
      DB=Object.assign({profile:defaultProfile(),
        customExercises:[],routines:[],workouts:[],bodyweight:[],meals:[],water:[]},parsed);
      DB.profile=Object.assign(defaultProfile(),DB.profile||{});
      DB.profile.notif=Object.assign({streak:true,completed:true,milestone:true,notLogged:true},DB.profile.notif||{});
    }
  }catch(e){console.error('Load failed:',e);}
}

function allExercises(){
  return BUILTIN_EXERCISES.concat((DB.customExercises||[]).map(function(e){return{name:e.name,cat:e.cat,custom:true,id:e.id};}));
}

/* ---------- TOAST ---------- */
function showToast(msg,isErr){
  var t=document.getElementById('toast');
  t.textContent=msg;
  t.style.background=isErr?'var(--red)':'var(--ink)';
  t.style.color=isErr?'#FFFFFF':'var(--bg)';
  void t.offsetWidth;
  t.style.opacity='1';
  t.style.transform='translateX(-50%) translateY(0)';
  clearTimeout(t._tmr);
  t._tmr=setTimeout(function(){t.style.opacity='0';t.style.transform='translateX(-50%) translateY(10px)';},2600);
}

/* ---------- NOTIFICATIONS ----------
   All four notification types are event-triggered (fire when
   something happens, or when the Home screen loads), never on a
   scheduled clock time. That means they work reliably without any
   server/push infrastructure — the honest limitation is only that
   they need the app open at the moment of the trigger, which for
   these four cases is naturally when the person is already using it.
*/
function notifyUser(msg){
  showToast(msg);
  if(typeof Notification!=='undefined' && Notification.permission==='granted'){
    try{ new Notification('Fitness Planner',{body:msg}); }catch(e){}
  }
}
function requestNotifPermission(){
  if(typeof Notification==='undefined'){showToast('Notifications are not supported on this browser.',true);return;}
  Notification.requestPermission().then(function(p){
    renderNotifSection();
    if(p==='granted')showToast('Notifications enabled!');
    else if(p==='denied')showToast('Permission denied. You can still see in-app alerts.',true);
  });
}
function toggleNotifSetting(key){
  DB.profile.notif[key]=!DB.profile.notif[key];
  sv();renderNotifSection();
}
function renderNotifSection(){
  var el=document.getElementById('notif-section');
  var supported=typeof Notification!=='undefined';
  var perm=supported?Notification.permission:'unsupported';
  var n=DB.profile.notif;
  var permBanner='';
  if(!supported){
    permBanner='<div style="font-size:13px;color:var(--text2);margin-bottom:12px;">Your browser does not support notifications, but you\'ll still see these as in-app alerts.</div>';
  } else if(perm!=='granted'){
    permBanner='<div style="font-size:13px;color:var(--text2);margin-bottom:12px;line-height:1.5;">Turn on device notifications, or these will still show as in-app alerts while you use the app.</div>'
      +'<button class="btn-ghost" onclick="requestNotifPermission()" style="margin-bottom:14px;">Enable Device Notifications</button>';
  } else {
    permBanner='<div style="font-size:13px;color:var(--green);margin-bottom:14px;">&check; Device notifications enabled</div>';
  }
  function row(key,title,sub){
    return '<div class="toggle-row"><div class="toggle-info"><div class="row-title">'+title+'</div><div class="row-sub">'+sub+'</div></div>'
      +'<label class="switch"><input type="checkbox" '+(n[key]?'checked':'')+' onchange="toggleNotifSetting(\''+key+'\')"><span class="slider"></span></label></div>';
  }
  el.innerHTML=permBanner
    +row('completed','Workout Completed','A quick nudge right when you finish logging a workout')
    +row('milestone','Close to a Milestone','When a set is within reach of a personal record')
    +row('streak','Streak Milestones','Celebrates 7, 14, 30, 50, and 100 day streaks')
    +row('notLogged','Haven\'t Logged Today','A gentle check-in if you open the app with nothing logged yet')
    +'<div style="font-size:11.5px;color:var(--text3);margin-top:12px;line-height:1.5;">These only fire while the app is open, triggered by something happening (finishing a workout, opening Home), never a scheduled time. No hourly reminders, no meal-time alerts.</div>';
}
function checkNotLoggedToday(){
  if(!DB.profile.notif.notLogged)return;
  var tod=today();
  var loggedToday=DB.workouts.some(function(w){return w.date===tod;});
  if(!loggedToday && DB.workouts.length>0){
    notifyUser("You haven't logged a workout today yet.");
  }
}
function checkStreakMilestone(streak){
  if(!DB.profile.notif.streak)return;
  var milestones=[7,14,30,50,100];
  if(milestones.indexOf(streak)>-1){
    notifyUser('🔥 '+streak+'-day streak! Keep it going.');
  }
}
function checkNearMilestone(exerciseName,weight){
  if(!DB.profile.notif.milestone)return;
  var prs=getAllPRs();
  var pr=prs.find(function(p){return p.exercise===exerciseName;});
  if(pr && weight<pr.weight && weight>=pr.weight*0.95){
    notifyUser("You're close to a milestone on "+exerciseName+"! Last PR: "+pr.weight+' '+DB.profile.unit+'.');
  }
}

/* ---------- CUSTOM CONFIRM MODAL (no native confirm() anywhere) ---------- */
var _confirmCb=null;
function fpConfirm(title,sub,cb){
  document.getElementById('confirm-title').textContent=title||'Delete this?';
  document.getElementById('confirm-sub').textContent=sub||'This cannot be undone.';
  _confirmCb=cb;
  document.getElementById('confirm-modal').classList.add('open');
}
function confirmOk(){
  document.getElementById('confirm-modal').classList.remove('open');
  if(_confirmCb){var cb=_confirmCb;_confirmCb=null;cb();}
}
function closeModal(id){document.getElementById(id).classList.remove('open');}
function openModal(id){document.getElementById(id).classList.add('open');}

/* ---------- NAVIGATION ---------- */
function go(id,el){
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  document.querySelectorAll('.ni').forEach(function(n){n.classList.remove('active');});
  document.getElementById('pg-'+id).classList.add('active');
  if(el)el.classList.add('active');
  if(id==='home'){renderHome();checkNotLoggedToday();}
  if(id==='workouts')renderWorkoutsTab();
  if(id==='progress')renderProgress();
  if(id==='nutrition')renderNutrition();
  if(id==='setup')renderSetup();
}

/* ============================================================
   RINGS (based on data logged in-app; no device sensor access
   is available to a PWA without a native wrapper, so these
   reflect what you log, not step/heart-rate hardware data)
   ============================================================ */
function ringSVG(pct,color,size){
  size=size||70;
  var r=size/2-6;
  var c=2*Math.PI*r;
  pct=Math.max(0,Math.min(1,pct));
  var offset=c*(1-pct);
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 '+size+' '+size+'" style="transform:rotate(-90deg);">'
    +'<circle cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" fill="none" stroke="var(--bg3)" stroke-width="7"/>'
    +'<circle cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" fill="none" stroke="'+color+'" stroke-width="7" '
    +'stroke-dasharray="'+c+'" stroke-dashoffset="'+offset+'" stroke-linecap="round"/></svg>';
}
function renderRings(){
  var tod=today();
  var todaysMeals=DB.meals.filter(function(m){return m.date===tod;});
  var calSum=todaysMeals.reduce(function(s,m){return s+(parseFloat(m.cal)||0);},0);
  var proteinSum=todaysMeals.reduce(function(s,m){return s+(parseFloat(m.protein)||0);},0);
  var trainedToday=DB.workouts.some(function(w){return w.date===tod;});

  var calPct=DB.profile.calGoal?calSum/DB.profile.calGoal:0;
  var proteinPct=DB.profile.proteinGoal?proteinSum/DB.profile.proteinGoal:0;
  var workoutPct=trainedToday?1:0;

  var html=''
    +'<div class="ring-wrap">'+ringSVG(calPct,'var(--accent)')+'<div class="ring-label">Calories</div><div class="ring-value">'+Math.round(calSum)+' / '+DB.profile.calGoal+'</div></div>'
    +'<div class="ring-wrap">'+ringSVG(proteinPct,'var(--blue)')+'<div class="ring-label">Protein</div><div class="ring-value">'+Math.round(proteinSum)+'g / '+DB.profile.proteinGoal+'g</div></div>'
    +'<div class="ring-wrap">'+ringSVG(workoutPct,'var(--green)')+'<div class="ring-label">Workout</div><div class="ring-value">'+(trainedToday?'Done':'Not yet')+'</div></div>';
  document.getElementById('home-rings').innerHTML=html;
}

/* ============================================================
   HOME / DASHBOARD
   ============================================================ */
function computeStreak(){
  if(!DB.workouts.length)return 0;
  var dates=Array.from(new Set(DB.workouts.map(function(w){return w.date;}))).sort().reverse();
  var tod=today();
  var cursor=dates[0]===tod?tod:(daysBetween(dates[0],tod)===1?dates[0]:null);
  if(!cursor)return 0;
  var idx=0;
  var expected=dates[0];
  var streak=0;
  while(idx<dates.length && dates[idx]===expected){
    streak++;
    var prev=new Date(parseLocalDate(expected));prev.setDate(prev.getDate()-1);
    expected=localDateStr(prev);
    idx++;
  }
  return streak;
}
function workoutsThisWeek(){
  var ws=weekStartOf(today());
  return DB.workouts.filter(function(w){return w.date>=ws;}).length;
}
function routineDaysArr(r){
  if(r.scheduledDays && r.scheduledDays.length)return r.scheduledDays;
  if(r.scheduledDay!==undefined && r.scheduledDay!==null && r.scheduledDay!=='')return [String(r.scheduledDay)];
  return [];
}
function renderTodaysWorkoutCard(){
  var dow=new Date().getDay();
  var scheduled=DB.routines.find(function(r){return routineDaysArr(r).indexOf(String(dow))>-1;});
  var card=document.getElementById('today-workout-card');
  if(scheduled){
    card.innerHTML='<div style="font-family:var(--font-head);font-weight:700;font-size:17px;margin-bottom:6px;">Today: '+scheduled.name+'</div>'
      +'<div style="font-size:13px;color:var(--text2);margin-bottom:14px;">'+scheduled.exercises.length+' exercises scheduled for today.</div>'
      +'<button class="btn-full" onclick="startWorkoutFromRoutine(\''+scheduled.id+'\')">Start Today\'s Workout</button>';
  } else {
    card.innerHTML='<div style="font-family:var(--font-head);font-weight:700;font-size:17px;margin-bottom:6px;">Ready for today?</div>'
      +'<div style="font-size:13px;color:var(--text2);margin-bottom:14px;">Start a blank workout, or set a scheduled day on a routine to see it here.</div>'
      +'<button class="btn-full" onclick="startBlankWorkout()">Start Workout</button>';
  }
}
function renderStreakBar(containerId){
  var el=document.getElementById(containerId);
  if(!el)return;
  if(!DB.workouts.length){el.innerHTML='';return;}

  var streak=computeStreak();
  var lastW=DB.workouts.slice().sort(function(a,b){return b.ts-a.ts;})[0];
  var lastDate=lastW?lastW.date:null;
  var tod=today();
  var daysAgo=lastDate?daysBetween(lastDate,tod):null;
  var lastLabel=daysAgo===0?'Today':daysAgo===1?'Yesterday':(daysAgo+' days ago');

  var streakEmoji=streak>=30?'🔥':streak>=7?'⚡':streak>=3?'✨':'💪';
  var streakPart=streak>0
    ?'<span style="font-weight:700;">'+streakEmoji+' '+streak+'-day streak</span>'
    :'';
  var lastPart=lastDate
    ?'<span style="opacity:.75;">Last workout: '+lastLabel+'</span>'
    :'';
  var sep=(streakPart&&lastPart)?'<span style="opacity:.4;margin:0 8px;">&middot;</span>':'';

  el.innerHTML='<div style="font-size:12px;color:rgba(255,255,255,.9);display:flex;align-items:center;flex-wrap:wrap;gap:2px;">'
    +streakPart+sep+lastPart+'</div>';
}

function renderHome(){
  document.getElementById('home-date').textContent=new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
  document.getElementById('home-greeting').textContent=DB.profile.name?('Let\'s train, '+DB.profile.name):'Let\'s train';
  document.getElementById('h-streak').textContent=computeStreak();
  document.getElementById('h-week').textContent=workoutsThisWeek();
  renderStreakBar('home-streak-bar');
  renderRings();
  renderTodaysWorkoutCard();

  var recentWorkouts=DB.workouts.slice().sort(function(a,b){return b.ts-a.ts;}).slice(0,2).map(function(w){
    return {type:'workout',ts:w.ts,html:'<div class="row-item" onclick="openWorkoutDetail(\''+w.id+'\')">'
      +'<div><div class="row-title">'+(w.name||'Workout')+'</div>'
      +'<div class="row-sub">'+fmtDate(w.date)+' &middot; '+w.exercises.length+' exercises</div></div></div>'};
  });
  var recentPRs=getRecentPRs(2).map(function(p){
    return {type:'pr',ts:parseLocalDate(p.date).getTime(),html:'<div class="row-item"><div><div class="row-title">'+p.exercise+'</div>'
      +'<div class="row-sub">'+p.weight+' '+DB.profile.unit+' &times; '+p.reps+'</div></div><span class="pill pill-pr">PR</span></div>'};
  });
  var combined=recentWorkouts.concat(recentPRs).sort(function(a,b){return b.ts-a.ts;}).slice(0,4);
  var rc=document.getElementById('home-recent');
  rc.innerHTML=combined.length?combined.map(function(x){return x.html;}).join(''):'<div class="empty">No activity yet. Start a workout or log a meal to get going.</div>';
}

/* ============================================================
   PERSONAL RECORDS
   ============================================================ */
function getAllPRs(){
  var best={};
  DB.workouts.forEach(function(w){
    w.exercises.forEach(function(ex){
      ex.sets.forEach(function(s){
        if(!s.done||!s.weight||!s.reps)return;
        var w1=parseFloat(s.weight);
        if(!best[ex.name]||w1>best[ex.name].weight){
          best[ex.name]={exercise:ex.name,weight:w1,reps:s.reps,date:w.date};
        }
      });
    });
  });
  return Object.values(best).sort(function(a,b){return b.weight-a.weight;});
}
function getRecentPRs(n){
  return getAllPRs().sort(function(a,b){return b.date.localeCompare(a.date);}).slice(0,n);
}

/* ============================================================
   WORKOUTS TAB (Log / Routines / Exercise Library)
   ============================================================ */
var _workoutsTab='log';
function switchWorkoutsTab(tab,el){
  _workoutsTab=tab;
  document.querySelectorAll('#pg-workouts .tab-btn').forEach(function(b){b.classList.remove('active');});
  if(el)el.classList.add('active');
  renderWorkoutsTab();
}
function renderWorkoutsTab(){
  var fab=document.getElementById('workouts-fab');
  renderStreakBar('workouts-streak-bar');
  if(_workoutsTab==='log'){fab.style.display='none';renderWorkoutLog();}
  else if(_workoutsTab==='routines'){fab.style.display='flex';renderRoutinesTab();}
  else {fab.style.display='none';renderExerciseLibraryTab();}
}
function workoutsFabAction(){
  if(_workoutsTab==='routines')openRoutineModal(null);
}
function renderWorkoutLog(){
  var list=DB.workouts.slice().sort(function(a,b){return b.ts-a.ts;});
  var html='';

  if(!list.length){
    // Rich empty state instead of a blank void
    html='<div style="text-align:center;padding:32px 16px 24px;">'
      +'<div style="font-size:52px;margin-bottom:16px;">🏋️</div>'
      +'<div style="font-family:var(--font-head);font-weight:800;font-size:20px;margin-bottom:10px;">No workouts yet</div>'
      +'<div style="font-size:14px;color:var(--text2);line-height:1.6;margin-bottom:28px;max-width:260px;margin-left:auto;margin-right:auto;">'
      +'Log your first session and start building your streak. Every PR starts somewhere.</div>'
      +'<button class="btn-full" onclick="startBlankWorkout()">+ Start Your First Workout</button>'
      +'</div>'
      +'<div class="section-title">QUICK START</div>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">'
      +_quickStartCard('Push Day','Chest, Shoulders, Triceps','💪','startQuickWorkout(\'push\')')
      +_quickStartCard('Pull Day','Back, Biceps','🚣','startQuickWorkout(\'pull\')')
      +_quickStartCard('Leg Day','Quads, Hamstrings, Glutes','🦵','startQuickWorkout(\'legs\')')
      +_quickStartCard('Full Body','Everything in one session','⚡','startQuickWorkout(\'full\')')
      +'</div>';
  } else {
    // Stats summary bar when there's data
    var totalWorkouts=list.length;
    var thisWeekCount=workoutsThisWeek();
    var streak=computeStreak();
    html='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px;">'
      +'<div class="stat-card"><div class="stat-num">'+totalWorkouts+'</div><div class="stat-label">Total</div></div>'
      +'<div class="stat-card"><div class="stat-num">'+thisWeekCount+'</div><div class="stat-label">This Week</div></div>'
      +'<div class="stat-card"><div class="stat-num">'+streak+'</div><div class="stat-label">Streak</div></div>'
      +'</div>'
      +'<button class="btn-full" style="margin-bottom:16px;" onclick="startBlankWorkout()">+ Start New Workout</button>';
    html+=list.map(function(w){
      var totalSets=w.exercises.reduce(function(s,e){return s+e.sets.filter(function(x){return x.done;}).length;},0);
      var totalVol=w.exercises.reduce(function(s,e){return s+e.sets.reduce(function(ss,set){return ss+((parseFloat(set.weight)||0)*(parseFloat(set.reps)||0));},0);},0);
      return '<div class="card" style="cursor:pointer;" onclick="openWorkoutDetail(\''+w.id+'\')">'
        +'<div style="display:flex;justify-content:space-between;align-items:flex-start;">'
        +'<div><div class="row-title">'+(w.name||'Workout')+'</div>'
        +'<div class="row-sub" style="margin-top:3px;">'+fmtDate(w.date)+'</div></div>'
        +'<div style="text-align:right;font-size:12px;color:var(--text2);">'
        +'<div>'+w.exercises.length+' exercises</div>'
        +'<div>'+totalSets+' sets</div>'
        +(totalVol>0?'<div>'+Math.round(totalVol).toLocaleString()+' '+DB.profile.unit+'</div>':'')
        +'</div></div>'
        +'</div>';
    }).join('');
  }
  document.getElementById('workouts-tab-content').innerHTML=html;
}
function _quickStartCard(name,desc,emoji,onclick){
  return '<div class="card" style="cursor:pointer;text-align:center;padding:16px 10px;" onclick="'+onclick+'">'
    +'<div style="font-size:28px;margin-bottom:8px;">'+emoji+'</div>'
    +'<div style="font-family:var(--font-head);font-weight:700;font-size:13px;margin-bottom:4px;">'+name+'</div>'
    +'<div style="font-size:11px;color:var(--text2);">'+desc+'</div>'
    +'</div>';
}
function startQuickWorkout(type){
  var templates={
    push:['Barbell Bench Press','Overhead Press','Incline Dumbbell Press','Lateral Raise','Tricep Pushdown'],
    pull:['Deadlift','Pull-Up','Barbell Row','Lat Pulldown','Barbell Curl'],
    legs:['Back Squat','Romanian Deadlift','Leg Press','Leg Curl','Calf Raise'],
    full:['Deadlift','Barbell Bench Press','Pull-Up','Overhead Press','Back Squat']
  };
  var names={push:'Push Day',pull:'Pull Day',legs:'Leg Day',full:'Full Body'};
  var exercises=(templates[type]||[]).map(function(n){
    return {name:n,sets:[{weight:'',reps:'',type:'normal',done:false}]};
  });
  activeWorkout={id:'w'+Date.now(),name:names[type]||'Workout',date:today(),ts:Date.now(),startedAt:Date.now(),exercises:exercises};
  openActiveWorkoutPage();
}
function renderExerciseLibraryTab(){
  var q=(document.getElementById('lib-search-input')?document.getElementById('lib-search-input').value:'').toLowerCase();
  var byCategory={};
  allExercises().forEach(function(e){
    if(!q||e.name.toLowerCase().indexOf(q)>-1)(byCategory[e.cat]=byCategory[e.cat]||[]).push(e);
  });
  var html='<div class="field" style="margin-bottom:12px;">'
    +'<input id="lib-search-input" placeholder="Search exercises..." oninput="renderExerciseLibraryTab()" value="'+(q||'')+'" '
    +'style="width:100%;padding:11px 14px;border:1.5px solid var(--border);border-radius:12px;font-size:14px;background:var(--bg);color:var(--text);"/>'
    +'</div>';
  Object.keys(byCategory).sort().forEach(function(cat){
    html+='<div class="section-title">'+cat+'</div>';
    byCategory[cat].forEach(function(e){
      html+='<div class="row-item"'+(e.custom?' onclick="openExerciseModal(\''+e.id+'\')"':'')+'>'
        +'<div class="row-title">'+e.name+'</div>'
        +(e.custom?'<span class="pill" style="background:var(--bg3);color:var(--text2);">Custom</span>':'')
        +'</div>';
    });
  });
  html+='<div style="margin-top:16px;"><button class="btn-ghost" onclick="openExerciseModal(null)">+ Add Custom Exercise</button></div>';
  document.getElementById('workouts-tab-content').innerHTML=html;
}
function renderRoutinesTab(){
  var html=DB.routines.length?DB.routines.map(function(r){
    var dayNames=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var daysArr=routineDaysArr(r);
    var dayLabel=daysArr.length?daysArr.map(function(d){return dayNames[+d];}).join(', '):null;
    return '<div class="card">'
      +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">'
      +'<div style="font-weight:700;font-size:16px;">'+r.name+'</div>'
      +'<div style="font-size:12px;color:var(--text2);">'+r.exercises.length+' exercises</div></div>'
      +(dayLabel?'<div class="pill" style="background:var(--accent-tint);color:var(--accent);margin-bottom:8px;">'+dayLabel+'</div>':'')
      +'<div style="font-size:13px;color:var(--text2);margin-bottom:12px;">'+r.exercises.map(function(e){return e.name;}).join(', ')+'</div>'
      +'<div class="btn-row" style="margin-top:0;">'
      +'<button class="btn-cancel" onclick="openRoutineModal(\''+r.id+'\')">Edit</button>'
      +'<button class="btn-save" onclick="startWorkoutFromRoutine(\''+r.id+'\')">Start</button>'
      +'</div></div>';
  }).join(''):'<div class="empty">No routines yet. Tap + to build your first one.</div>';
  document.getElementById('workouts-tab-content').innerHTML=html;
}

function openWorkoutDetail(id){
  var w=DB.workouts.find(function(x){return x.id===id;});
  if(!w)return;
  _wdCurrentId=id;
  document.getElementById('wd-title').textContent=(w.name||'Workout')+' — '+fmtDate(w.date);
  var body=document.getElementById('wd-body');
  body.innerHTML=w.exercises.map(function(ex){
    var setsHtml=ex.sets.map(function(s,i){
      return '<div style="font-size:13px;color:var(--text2);padding:4px 0;">Set '+(i+1)+': '+s.weight+' '+DB.profile.unit+' &times; '+s.reps+' reps'+(s.type&&s.type!=='normal'?' <span class="ex-chip">'+s.type+'</span>':'')+'</div>';
    }).join('');
    return '<div style="margin-bottom:16px;"><div style="font-weight:700;margin-bottom:6px;">'+ex.name+'</div>'+setsHtml+'</div>';
  }).join('');
  openModal('workout-detail-modal');
}
var _wdCurrentId=null;
function deleteWorkout(){
  fpConfirm('Delete this workout?','This cannot be undone.',function(){
    DB.workouts=DB.workouts.filter(function(w){return w.id!==_wdCurrentId;});
    sv();closeModal('workout-detail-modal');renderWorkoutsTab();renderHome();
  });
}

/* ============================================================
   ACTIVE WORKOUT SESSION
   ============================================================ */
var activeWorkout=null;
var _awTimerInterval=null;

function startBlankWorkout(){
  activeWorkout={id:'w'+Date.now(),name:'Workout',date:today(),ts:Date.now(),startedAt:Date.now(),exercises:[]};
  openActiveWorkoutPage();
}
function startWorkoutFromRoutine(routineId){
  var r=DB.routines.find(function(x){return x.id===routineId;});
  if(!r)return;
  activeWorkout={id:'w'+Date.now(),name:r.name,date:today(),ts:Date.now(),startedAt:Date.now(),
    exercises:r.exercises.map(function(re){return{name:re.name,sets:[{weight:'',reps:'',type:'normal',done:false}]};})};
  openActiveWorkoutPage();
}
function openActiveWorkoutPage(){
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  document.getElementById('pg-active-workout').classList.add('active');
  document.getElementById('main-nav').style.display='none';
  renderActiveWorkout();
  clearInterval(_awTimerInterval);
  _awTimerInterval=setInterval(updateWorkoutTimer,1000);
  updateWorkoutTimer();
}
function updateWorkoutTimer(){
  if(!activeWorkout)return;
  var secs=Math.floor((Date.now()-activeWorkout.startedAt)/1000);
  var m=Math.floor(secs/60);var s=secs%60;
  document.getElementById('aw-timer').textContent=m+':'+String(s).padStart(2,'0');
}
function renderActiveWorkout(){
  var c=document.getElementById('aw-exercise-list');
  c.innerHTML=activeWorkout.exercises.map(function(ex,exIdx){
    var setsHtml=ex.sets.map(function(s,sIdx){
      return '<div class="set-row">'
        +'<div class="set-num">'+(sIdx+1)+'</div>'
        +'<input class="set-input" type="number" placeholder="lbs" value="'+s.weight+'" onchange="updateSet('+exIdx+','+sIdx+',\'weight\',this.value)"/>'
        +'<input class="set-input" type="number" placeholder="reps" value="'+s.reps+'" onchange="updateSet('+exIdx+','+sIdx+',\'reps\',this.value)"/>'
        +'<div class="set-check '+(s.done?'done':'')+'" onclick="toggleSetDone('+exIdx+','+sIdx+')">'+(s.done?'&#10003;':'')+'</div>'
        +'<button onclick="deleteSet('+exIdx+','+sIdx+')" style="background:none;border:none;color:var(--text3);font-size:18px;cursor:pointer;padding:4px 6px;flex-shrink:0;line-height:1;" title="Delete set">&times;</button>'
        +'</div>';
    }).join('');
    return '<div class="card">'
      +'<div style="font-weight:700;margin-bottom:8px;">'+ex.name+'</div>'
      +setsHtml
      +'<button class="btn-ghost" style="margin-top:10px;" onclick="addSetToExercise('+exIdx+')">+ Add Set</button>'
      +'</div>';
  }).join('');
}
function updateSet(exIdx,sIdx,field,val){
  activeWorkout.exercises[exIdx].sets[sIdx][field]=val;
}
function toggleSetDone(exIdx,sIdx){
  var s=activeWorkout.exercises[exIdx].sets[sIdx];
  s.done=!s.done;
  if(s.done && s.weight){
    checkNearMilestone(activeWorkout.exercises[exIdx].name,parseFloat(s.weight));
  }
  renderActiveWorkout();
}
function addSetToExercise(exIdx){
  var sets=activeWorkout.exercises[exIdx].sets;
  var last=sets[sets.length-1];
  sets.push({weight:last?last.weight:'',reps:last?last.reps:'',type:'normal',done:false});
  renderActiveWorkout();
}
function deleteSet(exIdx,sIdx){
  var sets=activeWorkout.exercises[exIdx].sets;
  if(sets.length<=1){showToast('Need at least one set.',true);return;}
  sets.splice(sIdx,1);
  renderActiveWorkout();
}
function openAddExerciseToWorkout(){
  _pickerContext='workout';
  _pickerSelected=[];
  renderExercisePicker();
  openModal('exercise-picker-modal');
}
function finishWorkout(){
  if(!activeWorkout.exercises.length){showToast('Add at least one exercise first.',true);return;}
  activeWorkout.exercises=activeWorkout.exercises.map(function(ex){
    return {name:ex.name,sets:ex.sets.filter(function(s){return s.done;})};
  }).filter(function(ex){return ex.sets.length>0;});
  if(!activeWorkout.exercises.length){showToast('Log at least one completed set.',true);return;}
  DB.workouts.push(activeWorkout);
  sv();
  clearInterval(_awTimerInterval);
  var finishedName=activeWorkout.name;
  activeWorkout=null;
  document.getElementById('main-nav').style.display='flex';
  go('home',document.querySelector('.ni'));
  if(DB.profile.notif.completed)notifyUser('Workout completed: '+finishedName+'! 💪');
  var streak=computeStreak();
  checkStreakMilestone(streak);
}
function cancelWorkout(){
  fpConfirm('Cancel this workout?','Nothing will be saved.',function(){
    clearInterval(_awTimerInterval);
    activeWorkout=null;
    document.getElementById('main-nav').style.display='flex';
    closeModal('confirm-modal');
    go('home',document.querySelector('.ni'));
  });
}

/* ============================================================
   EXERCISE PICKER (shared: workout / routine)
   ============================================================ */
var _pickerContext=null;
var _pickerSelected=[];
function _pickerTargetNames(){
  if(_pickerContext==='workout' && activeWorkout)return activeWorkout.exercises.map(function(e){return e.name.toLowerCase();});
  if(_pickerContext==='routine')return _routineDraftExercises.map(function(e){return e.name.toLowerCase();});
  return [];
}
function renderExercisePicker(){
  var q=(document.getElementById('exercise-search').value||'').toLowerCase();
  var list=allExercises().filter(function(e){return e.name.toLowerCase().indexOf(q)>-1;});
  var byCategory={};
  list.forEach(function(e){(byCategory[e.cat]=byCategory[e.cat]||[]).push(e);});
  var alreadyIn=_pickerTargetNames();
  var html='<div style="font-size:11.5px;color:var(--text3);margin:-2px 0 12px;">Tap to select as many as you need, then hit Done.</div>';
  Object.keys(byCategory).sort().forEach(function(cat){
    html+='<div style="font-size:11px;font-weight:700;color:var(--text2);letter-spacing:.06em;margin:14px 0 6px;text-transform:uppercase;">'+cat+'</div>';
    byCategory[cat].forEach(function(e){
      var nameEsc=e.name.replace(/'/g,"\\'");
      var isAdded=alreadyIn.indexOf(e.name.toLowerCase())>-1;
      var isSelected=_pickerSelected.indexOf(e.name)>-1;
      if(isAdded){
        html+='<div class="row-item" style="opacity:.45;"><div class="row-title">'+e.name+'</div>'
          +'<span class="pill" style="background:var(--bg3);color:var(--text2);">Added</span></div>';
      } else {
        html+='<div class="row-item" onclick="toggleExercisePick(\''+nameEsc+'\')"><div class="row-title">'+e.name+'</div>'
          +'<div class="set-check '+(isSelected?'done':'')+'">'+(isSelected?'&#10003;':'')+'</div></div>';
      }
    });
  });
  // Always show an "Add new exercise" shortcut at the bottom
  var searchVal=document.getElementById('exercise-search').value.trim();
  html+='<div style="margin-top:18px;padding-top:14px;border-top:1px solid var(--border2);">'
    +'<div style="font-size:12px;color:var(--text3);margin-bottom:8px;">'
    +(list.length===0?"Can't find what you\'re looking for?":'Not seeing what you need?')
    +'</div>'
    +'<button onclick="openInlineAddExercise()" style="width:100%;padding:13px;border-radius:12px;'
    +'border:1.5px dashed var(--accent);background:none;color:var(--accent);'
    +'font-family:var(--font-head);font-weight:700;font-size:14px;cursor:pointer;">'
    +"+ Add New Exercise</button></div>";
  document.getElementById('exercise-picker-list').innerHTML=html;
}
var _reopenPickerAfterAdd=false;
function openInlineAddExercise(){
  var q=document.getElementById('exercise-search').value.trim();
  closeModal('exercise-picker-modal');
  _editingExerciseId=null;
  document.getElementById('exercise-modal-title').textContent='Add Exercise';
  document.getElementById('ex-name').value=q;
  document.getElementById('ex-category').value='Other';
  document.getElementById('exercise-del-btn').style.display='none';
  _reopenPickerAfterAdd=true;
  openModal('exercise-modal');
}
function toggleExercisePick(name){
  var i=_pickerSelected.indexOf(name);
  if(i>-1)_pickerSelected.splice(i,1);else _pickerSelected.push(name);
  renderExercisePicker();
}
function cancelExercisePicker(){
  _pickerSelected=[];
  closeModal('exercise-picker-modal');
}
function finalizeExercisePicker(){
  if(!_pickerSelected.length){showToast('Select at least one exercise.',true);return;}
  var alreadyIn=_pickerTargetNames();
  var added=[],skipped=[];
  _pickerSelected.forEach(function(name){
    if(alreadyIn.indexOf(name.toLowerCase())>-1){skipped.push(name);return;}
    if(_pickerContext==='workout'){
      activeWorkout.exercises.push({name:name,sets:[{weight:'',reps:'',type:'normal',done:false}]});
    } else if(_pickerContext==='routine'){
      _routineDraftExercises.push({name:name});
    }
    alreadyIn.push(name.toLowerCase());
    added.push(name);
  });
  if(_pickerContext==='workout')renderActiveWorkout();
  else if(_pickerContext==='routine')renderRoutineExerciseForm();
  _pickerSelected=[];
  document.getElementById('exercise-search').value='';
  closeModal('exercise-picker-modal');
  if(skipped.length){
    showToast(added.length?('Added '+added.length+'. Already had: '+skipped.join(', ')):('Already added: '+skipped.join(', ')),true);
  } else if(added.length){
    showToast('Added '+added.length+' exercise'+(added.length>1?'s':'')+'.');
  }
}

/* ============================================================
   ROUTINES
   ============================================================ */
var _editingRoutineId=null;
var _routineDraftExercises=[];
var _routineDraftDays=[];
function openRoutineModal(id){
  _editingRoutineId=id;
  var r=id?DB.routines.find(function(x){return x.id===id;}):null;
  document.getElementById('routine-modal-title').textContent=id?'Edit Routine':'New Routine';
  document.getElementById('r-name').value=r?r.name:'';
  _routineDraftDays=r?routineDaysArr(r).slice():[];
  _routineDraftExercises=r?JSON.parse(JSON.stringify(r.exercises)):[];
  document.getElementById('routine-del-btn').style.display=id?'block':'none';
  renderRoutineDaysPicker();
  renderRoutineExerciseForm();
  openModal('routine-modal');
}
function renderRoutineDaysPicker(){
  var el=document.getElementById('r-days-row');
  if(!el)return;
  var days=[{v:'1',l:'Mon'},{v:'2',l:'Tue'},{v:'3',l:'Wed'},{v:'4',l:'Thu'},{v:'5',l:'Fri'},{v:'6',l:'Sat'},{v:'0',l:'Sun'}];
  el.innerHTML=days.map(function(d){
    var active=_routineDraftDays.indexOf(d.v)>-1;
    return '<button type="button" class="tab-btn '+(active?'active':'')+'" style="padding:8px 12px;font-size:12px;" onclick="toggleRoutineDay(\''+d.v+'\')">'+d.l+'</button>';
  }).join('');
}
function toggleRoutineDay(v){
  var i=_routineDraftDays.indexOf(v);
  if(i>-1)_routineDraftDays.splice(i,1);else _routineDraftDays.push(v);
  renderRoutineDaysPicker();
}
function renderRoutineExerciseForm(){
  var c=document.getElementById('routine-exercise-list');
  c.innerHTML=_routineDraftExercises.map(function(e,i){
    return '<div class="row-item"><div class="row-title">'+e.name+'</div>'
      +'<button style="background:none;border:none;color:var(--red);font-size:13px;font-weight:600;" onclick="removeRoutineDraftExercise('+i+')">Remove</button></div>';
  }).join('');
}
function removeRoutineDraftExercise(i){
  _routineDraftExercises.splice(i,1);
  renderRoutineExerciseForm();
}
function addExerciseToRoutineForm(){
  _pickerContext='routine';
  _pickerSelected=[];
  renderExercisePicker();
  openModal('exercise-picker-modal');
}
function saveRoutine(){
  var name=document.getElementById('r-name').value.trim();
  if(!name){showToast('Give your routine a name.',true);return;}
  if(!_routineDraftExercises.length){showToast('Add at least one exercise.',true);return;}
  var entry={id:_editingRoutineId||('r'+Date.now()),name:name,exercises:_routineDraftExercises,
    scheduledDays:_routineDraftDays.slice()};
  if(_editingRoutineId){
    var i=DB.routines.findIndex(function(x){return x.id===_editingRoutineId;});
    if(i>-1)DB.routines[i]=entry;
  } else {
    DB.routines.push(entry);
  }
  sv();closeModal('routine-modal');renderWorkoutsTab();
  showToast('Routine saved!');
}
function deleteRoutine(){
  fpConfirm('Delete this routine?','This cannot be undone.',function(){
    DB.routines=DB.routines.filter(function(x){return x.id!==_editingRoutineId;});
    sv();closeModal('routine-modal');renderWorkoutsTab();
  });
}

/* ============================================================
   PROGRESS: BODY WEIGHT, VOLUME, PRS
   ============================================================ */
var _chartRange='week';
function switchChartRange(range,el){
  _chartRange=range;
  document.querySelectorAll('#pg-progress .tab-btn').forEach(function(b){b.classList.remove('active');});
  if(el)el.classList.add('active');
  drawWeightChart();drawVolumeChart();
}
function renderProgress(){
  document.getElementById('w-date').value=today();
  drawWeightChart();
  drawVolumeChart();
  var prs=getAllPRs();
  var c=document.getElementById('pr-list');
  c.innerHTML=prs.length?prs.map(function(p){
    return '<div class="row-item"><div><div class="row-title">'+p.exercise+'</div>'
      +'<div class="row-sub">'+fmtDateShort(p.date)+'</div></div>'
      +'<div style="text-align:right;"><div style="font-weight:700;">'+p.weight+' '+DB.profile.unit+'</div>'
      +'<div class="row-sub">&times; '+p.reps+' reps</div></div></div>';
  }).join(''):'<div class="empty">Log some workouts to start tracking personal records.</div>';
}
function openWeightModal(){openModal('weight-modal');}
function saveWeight(){
  var w=parseFloat(document.getElementById('w-weight').value);
  var d=document.getElementById('w-date').value||today();
  if(!w){showToast('Enter a weight.',true);return;}
  DB.bodyweight=DB.bodyweight.filter(function(x){return x.date!==d;});
  DB.bodyweight.push({date:d,weight:w});
  DB.bodyweight.sort(function(a,b){return a.date.localeCompare(b.date);});
  sv();closeModal('weight-modal');
  document.getElementById('w-weight').value='';
  if(document.getElementById('pg-progress').classList.contains('active'))drawWeightChart();
  showToast('Weight logged!');
}
function drawLineChart(canvasId,data,valueKey,unitLabel){
  var canvas=document.getElementById(canvasId);
  var ctx=canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if(data.length<2){
    ctx.fillStyle='#a8a196';ctx.font='13px sans-serif';ctx.textAlign='center';
    ctx.fillText(data.length===0?'Nothing logged yet':'Add one more entry to see a trend line',canvas.width/2,canvas.height/2);
    return;
  }
  var values=data.map(function(d){return d[valueKey];});
  var min=Math.min.apply(null,values);var max=Math.max.apply(null,values);
  var range=max-min||1;
  var padX=34,padY=20;
  var w=canvas.width-padX*2,h=canvas.height-padY*2;
  var accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#c4602e';
  ctx.strokeStyle=accent;ctx.lineWidth=3;ctx.beginPath();
  data.forEach(function(d,i){
    var x=padX+(i/(data.length-1))*w;
    var y=padY+h-((d[valueKey]-min)/range)*h;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  });
  ctx.stroke();
  ctx.fillStyle=accent;
  data.forEach(function(d,i){
    var x=padX+(i/(data.length-1))*w;
    var y=padY+h-((d[valueKey]-min)/range)*h;
    ctx.beginPath();ctx.arc(x,y,3.5,0,7);ctx.fill();
  });
  ctx.fillStyle='#7a7468';ctx.font='11px sans-serif';ctx.textAlign='left';
  ctx.fillText(Math.round(max)+unitLabel,4,padY+8);
  ctx.fillText(Math.round(min)+unitLabel,4,padY+h);
}
function drawWeightChart(){
  var data=_chartRange==='week'?DB.bodyweight.slice(-7):DB.bodyweight.slice(-30);
  drawLineChart('weight-chart',data,'weight',' '+DB.profile.unit);
}
function computeVolumeSeries(range){
  var byPeriod={};
  DB.workouts.forEach(function(w){
    var key=range==='week'?weekStartOf(w.date):monthStartOf(w.date);
    var vol=w.exercises.reduce(function(sum,ex){
      return sum+ex.sets.reduce(function(s,set){return s+((parseFloat(set.weight)||0)*(parseFloat(set.reps)||0));},0);
    },0);
    byPeriod[key]=(byPeriod[key]||0)+vol;
  });
  return Object.keys(byPeriod).sort().slice(-8).map(function(k){return {date:k,vol:byPeriod[k]};});
}
function drawVolumeChart(){
  var data=computeVolumeSeries(_chartRange);
  drawLineChart('volume-chart',data,'vol',' lbs');
}

/* ============================================================
   NUTRITION
   ============================================================ */
function quickLogWater(){
  adjustWater(1);
  var tod=today();
  var entry=DB.water.find(function(w){return w.date===tod;});
  var count=entry?entry.count:0;
  var goal=DB.profile.waterGoal||8;
  showToast('Water logged: '+count+' / '+goal+' glasses 💧');
}

function renderNutrition(){
  var tod=today();
  var meals=DB.meals.filter(function(m){return m.date===tod;});
  var cal=meals.reduce(function(s,m){return s+(parseFloat(m.cal)||0);},0);
  var protein=meals.reduce(function(s,m){return s+(parseFloat(m.protein)||0);},0);
  var carbs=meals.reduce(function(s,m){return s+(parseFloat(m.carbs)||0);},0);
  var fat=meals.reduce(function(s,m){return s+(parseFloat(m.fat)||0);},0);

  function macroBar(label,val,goal,color){
    var pct=goal?Math.min(100,(val/goal)*100):0;
    return '<div style="margin-bottom:12px;"><div style="display:flex;justify-content:space-between;font-size:13px;">'
      +'<span style="color:var(--text2);">'+label+'</span><span style="font-weight:600;">'+Math.round(val)+(goal?' / '+goal:'')+'</span></div>'
      +'<div class="macro-bar-bg"><div class="macro-bar-fill" style="width:'+pct+'%;background:'+color+';"></div></div></div>';
  }
  document.getElementById('macro-summary').innerHTML=
    macroBar('Calories',cal,DB.profile.calGoal,'var(--accent)')
    +macroBar('Protein (g)',protein,DB.profile.proteinGoal,'var(--blue)')
    +macroBar('Carbs (g)',carbs,null,'var(--gold)')
    +macroBar('Fat (g)',fat,null,'var(--green)');

  var c=document.getElementById('meal-list');
  c.innerHTML=meals.length?meals.map(function(m){
    return '<div class="row-item" onclick="openMealModal(\''+m.id+'\')"><div><div class="row-title">'+m.name+'</div>'
      +'<div class="row-sub">'+m.type+' &middot; '+m.cal+' cal</div></div>'
      +'<div class="row-sub">P '+m.protein+'g &middot; C '+m.carbs+'g &middot; F '+m.fat+'g</div></div>';
  }).join(''):'<div class="empty">No meals logged today. Tap + to add one.</div>';
  renderWaterSection();
}
var _editingMealId=null;
function openMealModal(id){
  _editingMealId=id;
  var m=id?DB.meals.find(function(x){return x.id===id;}):null;
  document.getElementById('meal-modal-title').textContent=id?'Edit Meal':'Log Meal';
  document.getElementById('m-type').value=m?m.type:'Breakfast';
  document.getElementById('m-name').value=m?m.name:'';
  document.getElementById('m-cal').value=m?m.cal:'';
  document.getElementById('m-protein').value=m?m.protein:'';
  document.getElementById('m-carbs').value=m?m.carbs:'';
  document.getElementById('m-fat').value=m?m.fat:'';
  document.getElementById('meal-del-btn').style.display=id?'block':'none';
  openModal('meal-modal');
}
function saveMeal(){
  var name=document.getElementById('m-name').value.trim();
  if(!name){showToast('Enter a meal name.',true);return;}
  var entry={
    id:_editingMealId||('m'+Date.now()),
    date:today(),
    type:document.getElementById('m-type').value,
    name:name,
    cal:parseFloat(document.getElementById('m-cal').value)||0,
    protein:parseFloat(document.getElementById('m-protein').value)||0,
    carbs:parseFloat(document.getElementById('m-carbs').value)||0,
    fat:parseFloat(document.getElementById('m-fat').value)||0
  };
  if(_editingMealId){
    var i=DB.meals.findIndex(function(x){return x.id===_editingMealId;});
    if(i>-1){entry.date=DB.meals[i].date;DB.meals[i]=entry;}
  } else {
    DB.meals.push(entry);
  }
  sv();closeModal('meal-modal');
  if(document.getElementById('pg-nutrition').classList.contains('active'))renderNutrition();
  if(document.getElementById('pg-home').classList.contains('active'))renderRings();
  showToast('Meal saved!');
}
function deleteMeal(){
  fpConfirm('Delete this meal?','This cannot be undone.',function(){
    DB.meals=DB.meals.filter(function(x){return x.id!==_editingMealId;});
    sv();closeModal('meal-modal');renderNutrition();
  });
}
function renderWaterSection(){
  var tod=today();
  var entry=DB.water.find(function(w){return w.date===tod;});
  var count=entry?entry.count:0;
  var goal=DB.profile.waterGoal||8;
  var pct=Math.min(100,(count/goal)*100);
  var glasses='';
  for(var i=0;i<goal;i++){
    glasses+='<div style="font-size:20px;opacity:'+(i<count?'1':'.25')+';transition:opacity .15s;">&#x1F4A7;</div>';
  }
  document.getElementById('water-section').innerHTML=
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">'
    +'<div style="font-family:var(--font-head);font-weight:700;font-size:15px;">Water</div>'
    +'<div style="font-size:13px;color:var(--text2);">'+count+' / '+goal+' glasses</div>'
    +'</div>'
    +'<div class="macro-bar-bg" style="margin-bottom:14px;"><div class="macro-bar-fill" style="width:'+pct+'%;background:var(--blue);"></div></div>'
    +'<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;">'+glasses+'</div>'
    +'<div style="display:flex;gap:10px;">'
    +'<button onclick="adjustWater(-1)" style="flex:1;padding:11px;border-radius:12px;border:1.5px solid var(--border);background:var(--bg3);font-size:20px;cursor:pointer;font-weight:700;color:var(--text2);">&#8722;</button>'
    +'<button onclick="adjustWater(1)" style="flex:2;padding:11px;border-radius:12px;border:none;background:var(--accent-grad,var(--accent));color:#fff;font-family:var(--font-head);font-weight:700;font-size:14px;cursor:pointer;">+ Add Glass</button>'
    +'</div>';
}
function adjustWater(delta){
  var tod=today();
  var entry=DB.water.find(function(w){return w.date===tod;});
  if(!entry){entry={date:tod,count:0};DB.water.push(entry);}
  entry.count=Math.max(0,entry.count+delta);
  sv();
  renderWaterSection();
  if(document.getElementById('pg-home').classList.contains('active'))renderRings();
}

/* ============================================================
   SETUP: profile, theme, notifications, exercises
   ============================================================ */
function applyTheme(key){
  var t=THEMES[key];if(!t)return;
  var r=document.documentElement.style;
  r.setProperty('--bg',t.bg);
  r.setProperty('--bg2',t.bg2);
  r.setProperty('--bg3',t.bg3);
  r.setProperty('--bg4',t.bg2);
  r.setProperty('--text',t.text);
  r.setProperty('--ink',t.text);
  r.setProperty('--text2',t.text2);
  r.setProperty('--text3',t.text3);
  r.setProperty('--accent',t.accent);
  r.setProperty('--accent2',t.accent2);
  r.setProperty('--accent-tint',t.tint);
  r.setProperty('--accent-grad-1',t.gradA);
  r.setProperty('--accent-grad-2',t.gradB);
  r.setProperty('--border',t.border);
  r.setProperty('--border2',t.border2);
  var metaTheme=document.querySelector('meta[name="theme-color"]');
  if(metaTheme)metaTheme.setAttribute('content',t.bg);
  DB.profile.theme=key;
}
function themeCardHTML(key,t,active){
  var swatchesHtml=t.swatches.map(function(c){
    return '<div style="width:22px;height:22px;border-radius:50%;background:'+c+';border:1px solid rgba(0,0,0,.12);"></div>';
  }).join('');
  var btnTextColor=t.isDark?'#000':'#fff';
  return '<div class="theme-card" data-tk="'+key+'" style="cursor:pointer;border-radius:16px;padding:18px;margin-bottom:14px;'
    +'background:linear-gradient(135deg,'+t.bg+' 0%,'+t.bg2+' 100%);border:2px solid '+(active?t.accent:'transparent')+';box-shadow:0 2px 10px rgba(0,0,0,.08);">'
    +'<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">'
    +'<div><div style="font-family:var(--font-head);font-weight:700;font-size:16px;color:'+t.text+';">'+t.name+(active?' &check;':'')+'</div></div></div>'
    +'<div style="display:flex;gap:8px;margin-bottom:14px;">'+swatchesHtml+'</div>'
    +'<div style="display:inline-block;background:linear-gradient(135deg,'+t.gradA+' 0%,'+t.gradB+' 100%);color:'+btnTextColor+';font-family:var(--font-head);font-weight:600;font-size:13px;padding:10px 20px;border-radius:10px;">Start Workout</div>'
    +'</div>';
}
function renderThemeCards(containerId,onSelect){
  var el=document.getElementById(containerId);
  el.innerHTML=Object.keys(THEMES).map(function(k){
    return themeCardHTML(k,THEMES[k],DB.profile.theme===k);
  }).join('');
  el.onclick=function(e){
    var card=e.target.closest('.theme-card');
    if(!card)return;
    var key=card.dataset.tk;
    applyTheme(key);sv();
    renderThemeCards(containerId,onSelect);
    if(onSelect)onSelect(key);
  };
}
function renderThemeSwatches(){
  renderThemeCards('theme-swatches',null);
}
var _settingsTab='profile';
function switchSettingsTab(tab,el){
  _settingsTab=tab;
  document.querySelectorAll('#pg-setup .tab-btn').forEach(function(b){b.classList.remove('active');});
  if(el)el.classList.add('active');
  renderSettingsTab();
}
function renderSetup(){
  _settingsTab='profile';
  document.querySelectorAll('#pg-setup .tab-btn').forEach(function(b,i){b.classList.toggle('active',i===0);});
  renderSettingsTab();
}
function renderSettingsTab(){
  var el=document.getElementById('settings-tab-content');
  if(_settingsTab==='profile') renderSettingsProfile(el);
  else if(_settingsTab==='theme') renderSettingsTheme(el);
  else if(_settingsTab==='tools') renderSettingsTools(el);
  else renderSettingsLibrary(el);
}
function renderSettingsProfile(el){
  el.innerHTML=
    '<div class="field"><label>Your Name</label><input id="s-name" placeholder="e.g. Jessica" value="'+(DB.profile.name||'')+'"/></div>'
    +'<div class="field"><label>Weight Unit</label><select id="s-unit" onchange="renderCalcFields()">'
    +'<option value="lbs"'+(DB.profile.unit==='lbs'?' selected':'')+'>lbs</option>'
    +'<option value="kg"'+(DB.profile.unit==='kg'?' selected':'')+'>kg</option>'
    +'</select></div>'
    +'<div class="field"><label>Daily Calorie Goal</label><input type="number" id="s-cal-goal" placeholder="e.g. 2000" value="'+(DB.profile.calGoal||'')+'"/></div>'
    +'<div class="field"><label>Daily Protein Goal (g)</label><input type="number" id="s-protein-goal" placeholder="e.g. 150" value="'+(DB.profile.proteinGoal||'')+'"/></div>'
    +'<div class="field"><label>Daily Water Goal (glasses)</label><input type="number" id="s-water-goal" placeholder="e.g. 8" value="'+(DB.profile.waterGoal||'')+'"/></div>'
    +'<button class="btn-full" onclick="saveProfile()">Save</button>'
    +'<div class="section-title">Calorie &amp; BMI Calculator</div>'
    +'<div class="card">'
    +'<div style="font-size:13px;color:var(--text2);margin-bottom:12px;line-height:1.6;">Estimate your BMI and daily calorie target based on your stats and goal.</div>'
    +'<div class="card" style="background:var(--accent-tint,#f2ead8);border-color:var(--accent2);margin-bottom:14px;">'
    +'<div style="font-size:12px;line-height:1.6;color:var(--text2);">&#9432; &nbsp;<strong>About BMI:</strong> BMI is one measure and does not fully reflect body composition or true fitness. Muscle mass, bone density, and other factors mean BMI alone is not a complete picture of your health.</div>'
    +'</div>'
    +'<div class="field"><label>Biological Sex</label><select id="c-sex">'
    +'<option value="female"'+(DB.profile.calcSex==='female'?' selected':'')+'>Female</option>'
    +'<option value="male"'+(DB.profile.calcSex==='male'?' selected':'')+'>Male</option>'
    +'</select></div>'
    +'<div class="field"><label>Age</label><input type="number" id="c-age" placeholder="e.g. 28" value="'+(DB.profile.calcAge||'')+'"/></div>'
    +'<div class="field" id="c-height-wrap"></div>'
    +'<div class="field" id="c-weight-wrap"></div>'
    +'<div class="field"><label>Activity Level</label><select id="c-activity">'
    +'<option value="1.2"'+(DB.profile.calcActivity==1.2?' selected':'')+'>Sedentary (little/no exercise)</option>'
    +'<option value="1.375"'+(DB.profile.calcActivity==1.375?' selected':'')+'>Light (1-3 days/week)</option>'
    +'<option value="1.55"'+(DB.profile.calcActivity==1.55?' selected':'')+'>Moderate (3-5 days/week)</option>'
    +'<option value="1.725"'+(DB.profile.calcActivity==1.725?' selected':'')+'>Active (6-7 days/week)</option>'
    +'<option value="1.9"'+(DB.profile.calcActivity==1.9?' selected':'')+'>Very Active (hard exercise + physical job)</option>'
    +'</select></div>'
    +'<div class="field"><label>Goal</label><select id="c-goal" onchange="toggleCalcRate()">'
    +'<option value="lose"'+(DB.profile.calcGoalType==='lose'?' selected':'')+'>Lose Weight</option>'
    +'<option value="maintain"'+(DB.profile.calcGoalType==='maintain'?' selected':'')+'>Maintain Weight</option>'
    +'<option value="gain"'+(DB.profile.calcGoalType==='gain'?' selected':'')+'>Gain Weight</option>'
    +'</select></div>'
    +'<div class="field" id="c-rate-wrap"><label>Rate</label><select id="c-rate">'
    +'<option value="250"'+(DB.profile.calcRate==250?' selected':'')+'>Mild — ~0.5 lb / week</option>'
    +'<option value="500"'+(DB.profile.calcRate==500?' selected':'')+'>Moderate — ~1 lb / week</option>'
    +'<option value="750"'+(DB.profile.calcRate==750?' selected':'')+'>Aggressive — ~1.5 lb / week</option>'
    +'</select></div>'
    +'<button class="btn-full" onclick="calculateCalories()">Calculate</button>'
    +'<div id="calc-results"></div>'
    +'</div>';
  toggleCalcRate();
  renderCalcFields();
}
function renderSettingsTheme(el){
  el.innerHTML='<div class="theme-grid" id="theme-swatches"></div>'
    +'<div class="section-title">Notifications</div>'
    +'<div class="card" id="notif-section"></div>';
  renderThemeSwatches();
  renderNotifSection();
}
function renderSettingsTools(el){
  el.innerHTML='<div class="section-title" style="margin-top:0;">Cloud Backup</div>'
    +'<div class="upsell-card"><div class="upsell-title">Want automatic Google Drive backup?</div><div class="upsell-text">The full version of Fitness Planner backs up your workouts, routines, and progress to your own Google Drive automatically, so it\'s never at risk.</div><a class="upsell-btn" href="https://www.etsy.com/listing/4534561739/fitness-tracker-app-live-workout-timer" target="_blank" rel="noopener">Get it on Etsy</a></div>'
    +'<div class="section-title">Export</div>'
    +'<button class="btn-ghost" onclick="exportPDF()">Export PDF Report</button>'
    +'<button class="btn-ghost" onclick="downloadBackup()">Download Backup File</button>'
    +'<button class="btn-ghost" onclick="document.getElementById(\'restoreFileInput\').click()">Restore From File</button>'
    +'<input type="file" id="restoreFileInput" accept=".json" style="display:none;" onchange="restoreFromFile(event)">';
}
function renderSettingsLibrary(el){
  el.innerHTML='<button class="btn-ghost" style="margin-top:0;" onclick="openExerciseModal(null)">+ Add Custom Exercise</button>'
    +'<div id="custom-exercise-list" style="margin-top:12px;"></div>';
  renderCustomExerciseList();
}
function renderCalcFields(){
  var unit=DB.profile.unit||'lbs';
  var hWrap=document.getElementById('c-height-wrap');
  var wWrap=document.getElementById('c-weight-wrap');
  if(!hWrap||!wWrap)return;
  var hCm=DB.profile.calcHeightCm;
  if(unit==='lbs'){
    var ftin=hCm?cmToFtIn(hCm):{ft:'',in:''};
    hWrap.innerHTML='<label>Height</label><div style="display:flex;gap:8px;">'
      +'<input type="number" id="c-height-ft" placeholder="ft" value="'+(ftin.ft||'')+'"/>'
      +'<input type="number" id="c-height-in" placeholder="in" value="'+(ftin.in||'')+'"/></div>';
  }else{
    hWrap.innerHTML='<label>Height (cm)</label><input type="number" id="c-height-cm" placeholder="e.g. 170" value="'+(hCm||'')+'"/>';
  }
  var latest=(DB.bodyweight&&DB.bodyweight.length)?DB.bodyweight[DB.bodyweight.length-1].weight:null;
  var wVal;
  if(latest!=null){wVal=latest;}
  else if(DB.profile.calcWeightKg){wVal=unit==='lbs'?Math.round(kgToLbs(DB.profile.calcWeightKg)*10)/10:Math.round(DB.profile.calcWeightKg*10)/10;}
  else{wVal='';}
  wWrap.innerHTML='<label>Current Weight ('+unit+')</label><input type="number" step="0.1" id="c-weight" placeholder="e.g. '+(unit==='lbs'?'165':'75')+'" value="'+wVal+'"/>'
    +(latest!=null?'<div class="row-sub" style="margin-top:4px;">Using your most recent logged weight — edit if needed.</div>':'');
}
function toggleCalcRate(){
  var g=document.getElementById('c-goal').value;
  document.getElementById('c-rate-wrap').style.display=g==='maintain'?'none':'block';
}
function calculateCalories(){
  var unit=DB.profile.unit||'lbs';
  var sex=document.getElementById('c-sex').value;
  var age=parseFloat(document.getElementById('c-age').value);
  var heightCm;
  if(unit==='lbs'){
    var ft=parseFloat(document.getElementById('c-height-ft').value)||0;
    var inch=parseFloat(document.getElementById('c-height-in').value)||0;
    heightCm=ftInToCm(ft,inch);
  }else{
    heightCm=parseFloat(document.getElementById('c-height-cm').value);
  }
  var weightInput=parseFloat(document.getElementById('c-weight').value);
  var results=document.getElementById('calc-results');
  if(!age||!heightCm||!weightInput){
    results.innerHTML='<div class="row-sub" style="color:var(--red);margin-top:14px;">Please fill in your age, height, and weight.</div>';
    return;
  }
  var weightKg=unit==='lbs'?lbsToKg(weightInput):weightInput;
  var activity=parseFloat(document.getElementById('c-activity').value);
  var goal=document.getElementById('c-goal').value;
  var rate=parseFloat(document.getElementById('c-rate').value)||0;

  DB.profile.calcSex=sex;DB.profile.calcAge=age;DB.profile.calcHeightCm=heightCm;
  DB.profile.calcWeightKg=weightKg;DB.profile.calcActivity=activity;
  DB.profile.calcGoalType=goal;DB.profile.calcRate=rate;
  sv();

  var bmi=weightKg/((heightCm/100)*(heightCm/100));
  var bmr=sex==='male'
    ?(10*weightKg+6.25*heightCm-5*age+5)
    :(10*weightKg+6.25*heightCm-5*age-161);
  var tdee=bmr*activity;
  var target=tdee;
  if(goal==='lose')target=tdee-rate;
  else if(goal==='gain')target=tdee+rate;
  var floor=sex==='male'?1500:1200;
  target=Math.max(target,floor);

  var bmiCat=bmi<18.5?'Underweight':bmi<25?'Healthy Range':bmi<30?'Overweight':'Obese';
  var bmiColor=bmi<18.5?'var(--blue)':bmi<25?'var(--green)':bmi<30?'var(--gold)':'var(--red)';
  var weeklyLbs=(rate*7/3500).toFixed(1);
  var goalNote=goal==='lose'?('Target for ~'+weeklyLbs+' lb/week loss'):goal==='gain'?('Target for ~'+weeklyLbs+' lb/week gain'):'Maintenance target';
  var roundedTarget=Math.round(target/10)*10;

  results.innerHTML=
    '<div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border2);">'
    +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">'
    +'<div class="row-title">BMI</div><div style="font-weight:700;color:'+bmiColor+';">'+bmi.toFixed(1)+' &middot; '+bmiCat+'</div></div>'
    +'<div style="display:flex;justify-content:space-between;margin-bottom:10px;"><div class="row-sub">Maintenance Calories</div><div style="font-weight:600;">'+Math.round(tdee)+' cal/day</div></div>'
    +'<div style="display:flex;justify-content:space-between;margin-bottom:16px;"><div class="row-sub">'+goalNote+'</div><div style="font-weight:600;">'+roundedTarget+' cal/day</div></div>'
    +'<button class="btn-ghost" style="margin-top:0;" onclick="applyCalcGoal('+roundedTarget+')">Use '+roundedTarget+' as My Calorie Goal</button>'
    +'</div>';
}
function applyCalcGoal(val){
  document.getElementById('s-cal-goal').value=val;
  showToast('Calorie goal updated — tap Save to confirm');
}
function saveProfile(){
  DB.profile.name=document.getElementById('s-name').value.trim();
  DB.profile.unit=document.getElementById('s-unit').value;
  DB.profile.calGoal=parseFloat(document.getElementById('s-cal-goal').value)||2000;
  DB.profile.proteinGoal=parseFloat(document.getElementById('s-protein-goal').value)||150;
  DB.profile.waterGoal=parseFloat(document.getElementById('s-water-goal').value)||8;
  sv();showToast('Saved!');renderHome();
}
function renderCustomExerciseList(){
  var c=document.getElementById('custom-exercise-list');
  var list=DB.customExercises||[];
  c.innerHTML=list.length?list.map(function(e){
    return '<div class="row-item" onclick="openExerciseModal(\''+e.id+'\')"><div><div class="row-title">'+e.name+'</div><div class="row-sub">'+e.cat+'</div></div></div>';
  }).join(''):'';
}
var _editingExerciseId=null;
function openExerciseModal(id){
  _editingExerciseId=id;
  var e=id?(DB.customExercises||[]).find(function(x){return x.id===id;}):null;
  document.getElementById('exercise-modal-title').textContent=id?'Edit Exercise':'Add Exercise';
  document.getElementById('ex-name').value=e?e.name:'';
  document.getElementById('ex-category').value=e?e.cat:'Chest';
  document.getElementById('exercise-del-btn').style.display=id?'block':'none';
  openModal('exercise-modal');
}
function saveCustomExercise(){
  var name=document.getElementById('ex-name').value.trim();
  if(!name){showToast('Enter an exercise name.',true);return;}
  var cat=document.getElementById('ex-category').value;
  if(!DB.customExercises)DB.customExercises=[];
  var entry={id:_editingExerciseId||('ce'+Date.now()),name:name,cat:cat};
  if(_editingExerciseId){
    var i=DB.customExercises.findIndex(function(x){return x.id===_editingExerciseId;});
    if(i>-1)DB.customExercises[i]=entry;
  } else {
    DB.customExercises.push(entry);
  }
  sv();closeModal('exercise-modal');
  if(_reopenPickerAfterAdd){
    _reopenPickerAfterAdd=false;
    // Auto-select the new exercise and reopen picker so they can add it immediately
    if(_pickerSelected.indexOf(name)===-1)_pickerSelected.push(name);
    document.getElementById('exercise-search').value='';
    renderExercisePicker();
    openModal('exercise-picker-modal');
  } else {
    if(_settingsTab==='library')renderCustomExerciseList();
  }
  showToast('Exercise saved! It\'s now selected.');
}
function deleteCustomExercise(){
  fpConfirm('Delete this exercise?','This cannot be undone.',function(){
    DB.customExercises=DB.customExercises.filter(function(x){return x.id!==_editingExerciseId;});
    sv();closeModal('exercise-modal');renderCustomExerciseList();
  });
}

/* ---------- MANUAL BACKUP / RESTORE (file-based) ---------- */
function downloadBackup(){
  var blob=new Blob([JSON.stringify(DB,null,2)],{type:'application/json'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a');
  a.href=url;a.download='fitness-planner-backup-'+today()+'.json';
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Backup downloaded!');
}
function restoreFromFile(event){
  var file=event.target.files[0];
  if(!file)return;
  var reader=new FileReader();
  reader.onload=function(e){
    try{
      var data=JSON.parse(e.target.result);
      if(!data||!data.profile){showToast('Backup file looks invalid.',true);return;}
      DB=data;sv();
      showToast('Restored from file!');
      setTimeout(function(){location.reload();},1200);
    }catch(err){
      showToast('Could not read that file.',true);
    }
  };
  reader.readAsText(file);
}

/* ============================================================
   PDF EXPORT
   Since this is a static client-side app with no server and no
   bundler, PDF export uses the browser's own print-to-PDF via a
   clean, formatted print view rather than a PDF-generation library.
   ============================================================ */
function exportPDF(){
  var prs=getAllPRs();
  var recentWorkouts=DB.workouts.slice().sort(function(a,b){return b.ts-a.ts;}).slice(0,15);
  var w=window.open('','_blank');
  if(!w){showToast('Please allow pop-ups to export a PDF.',true);return;}
  var html='<html><head><title>Fitness Planner Report</title><style>'
    +'body{font-family:Arial,sans-serif;padding:30px;color:#2c2b28;}'
    +'h1{font-size:22px;margin-bottom:4px;}h2{font-size:15px;margin:24px 0 8px;border-bottom:1px solid #ddd;padding-bottom:4px;}'
    +'table{width:100%;border-collapse:collapse;font-size:13px;}td,th{padding:6px 8px;text-align:left;border-bottom:1px solid #eee;}'
    +'</style></head><body>'
    +'<h1>Fitness Planner Report</h1><div style="color:#7a7468;font-size:13px;">'+(DB.profile.name?DB.profile.name+' &middot; ':'')+new Date().toLocaleDateString()+'</div>'
    +'<h2>Personal Records</h2><table><tr><th>Exercise</th><th>Best</th><th>Reps</th><th>Date</th></tr>'
    +prs.map(function(p){return '<tr><td>'+p.exercise+'</td><td>'+p.weight+' '+DB.profile.unit+'</td><td>'+p.reps+'</td><td>'+fmtDateShort(p.date)+'</td></tr>';}).join('')
    +'</table>'
    +'<h2>Recent Workouts</h2><table><tr><th>Date</th><th>Workout</th><th>Exercises</th></tr>'
    +recentWorkouts.map(function(wo){return '<tr><td>'+fmtDateShort(wo.date)+'</td><td>'+(wo.name||'Workout')+'</td><td>'+wo.exercises.map(function(e){return e.name;}).join(', ')+'</td></tr>';}).join('')
    +'</table></body></html>';
  w.document.write(html);
  w.document.close();
  setTimeout(function(){w.print();},300);
}


/* ============================================================
   GOOGLE DRIVE BACKUP — removed for the free trial demo. The full
   version syncs to the user's own Google Drive; the demo never
   loads the Google Identity script or requests OAuth, and Settings
   > Tools shows an upsell card in place of the Drive UI instead.
   ============================================================ */

/* ============================================================
   ONBOARDING (first launch only)
   ============================================================ */
function finishOnboarding(){
  DB.profile.onboarded=true;
  sv();
  document.getElementById('pg-onboarding').classList.remove('active');
  document.getElementById('pg-home').classList.add('active');
  document.getElementById('main-nav').style.display='flex';
  renderHome();
}

/* ============================================================
   FREE TRIAL (demo build only)
   ============================================================ */
var DEMO_TRIAL_DAYS=14;
function demoTrialDaysLeft(){
  var KEY='mfs_fitness_demo_since';
  var since;
  try{since=localStorage.getItem(KEY);}catch(e){since=null;}
  if(!since){since=Date.now();try{localStorage.setItem(KEY,since);}catch(e){}}
  var elapsedDays=Math.floor((Date.now()-parseInt(since,10))/86400000);
  return DEMO_TRIAL_DAYS-elapsedDays;
}
function enforceDemoTrial(){
  var daysLeft=demoTrialDaysLeft();
  var banner=document.getElementById('demo-banner');
  if(daysLeft<=0){
    document.getElementById('trial-lock').style.display='flex';
    document.body.style.overflow='hidden';
    if(banner)banner.style.display='none';
    return true;
  }
  if(banner){
    var noun=daysLeft===1?'day':'days';
    banner.innerHTML='<b>Free demo</b> &middot; '+daysLeft+' '+noun+' left &middot; <a href="https://www.etsy.com/listing/4534561739/fitness-tracker-app-live-workout-timer" target="_blank" rel="noopener">Get the full app &rarr;</a>';
  }
  return false;
}

/* ============================================================
   INIT
   ============================================================ */
ld();
applyTheme(DB.profile.theme||'warmNeutrals');
if(document.getElementById('w-date'))document.getElementById('w-date').value=today();

if(!DB.profile.onboarded){
  document.getElementById('pg-home').classList.remove('active');
  document.getElementById('pg-onboarding').classList.add('active');
  document.getElementById('main-nav').style.display='none';
  renderThemeCards('theme-onboarding-cards',null);
} else {
  renderHome();
}

enforceDemoTrial();
