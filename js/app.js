const defaults=[
{id:"b1",type:"blog",title:"How to Build a Resume That Gets Noticed",meta:"Career Guide",description:"A strong resume is clear, relevant and easy to scan. Focus on measurable achievements, tailor your skills to the opportunity and keep your most important information visible.",date:"July 19, 2026"},
{id:"b2",type:"blog",title:"5 Skills Employers Are Looking For",meta:"Career Growth",description:"Communication, problem solving, digital literacy, adaptability and collaboration remain valuable across industries. Build proof of these skills through real projects and experiences.",date:"July 18, 2026"},
{id:"j1",type:"job",title:"Frontend Developer",meta:"TechNova",location:"Remote",link:"",description:"We are looking for a frontend developer comfortable with HTML, CSS and JavaScript. Build responsive interfaces, collaborate with designers and improve user experiences.",date:"July 19, 2026"}
];
function getPosts(){let p=JSON.parse(localStorage.getItem("ja_posts")||"null");if(!p){p=defaults;localStorage.setItem("ja_posts",JSON.stringify(p))}return p}
function savePosts(p){localStorage.setItem("ja_posts",JSON.stringify(p))}
function esc(s=""){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function card(p){return `<a class="card contentCard" data-type="${p.type}" href="post.html?id=${encodeURIComponent(p.id)}"><span class="tag">${esc(p.type==="job"?(p.meta||"Job Opportunity"):(p.meta||"Article"))}</span><h3>${esc(p.title)}</h3><p>${esc(p.description.slice(0,130))}${p.description.length>130?"...":""}</p><div class="foot"><span>${p.type==="job"?esc(p.location||"Location flexible"):"Read article"}</span><span>${esc(p.date||"")}</span></div></a>`}
function renderHome(){
 const bg=document.querySelector("#blogGrid"),jg=document.querySelector("#jobGrid");if(!bg||!jg)return;
 const posts=getPosts();const draw=(q,type)=>{const a=posts.filter(x=>x.type===type);q.innerHTML=a.length?a.map(card).join(""):`<div class="empty">No ${type}s published yet.</div>`};draw(bg,"blog");draw(jg,"job");
 const s=document.querySelector("#search"),f=document.querySelector("#filter");function filter(){let term=s.value.toLowerCase(),type=f.value;document.querySelectorAll(".contentCard").forEach(c=>{c.style.display=((type==="all"||c.dataset.type===type)&&c.innerText.toLowerCase().includes(term))?"flex":"none"})}s.addEventListener("input",filter);f.addEventListener("change",filter)
}
function renderPost(){
 const box=document.querySelector("#postDetail");if(!box)return;const id=new URLSearchParams(location.search).get("id"),p=getPosts().find(x=>x.id===id);
 if(!p){box.innerHTML="<h1>Post not found</h1>";return}
 document.title=p.title+" — Jobs Era";box.innerHTML=`<span class="tag">${esc(p.type==="job"?"Job Opportunity":p.meta)}</span><h1>${esc(p.title)}</h1><p style="color:var(--muted)">${esc(p.meta||"")} ${p.location?"• "+esc(p.location):""} • ${esc(p.date||"")}</p><div class="content">${esc(p.description)}</div>${p.type==="job"&&p.link?`<div class="apply"><a class="btn" target="_blank" rel="noopener" href="${esc(p.link)}">Apply for this job</a></div>`:""}`;
 const key="ja_comments_"+id,list=document.querySelector("#commentList");function comments(){const a=JSON.parse(localStorage.getItem(key)||"[]");list.innerHTML=a.length?a.map(x=>`<div class="comment"><b>${esc(x.name)}</b><p>${esc(x.text)}</p><small>${esc(x.date)}</small></div>`).join(""):`<p class="empty">Be the first to comment.</p>`}comments();
 const user=currentUser();const nameInput=document.querySelector("#commentName");if(user){nameInput.value=user.name;nameInput.readOnly=true;nameInput.placeholder="Logged in as "+user.name}else{nameInput.style.display="none";document.querySelector("#commentText").placeholder="Please login to write a comment..."}
 document.querySelector("#commentForm").onsubmit=e=>{e.preventDefault();const u=currentUser();if(!u){location.href="login.html";return}const a=JSON.parse(localStorage.getItem(key)||"[]");a.unshift({name:u.name,userId:u.id,text:document.querySelector("#commentText").value,date:new Date().toLocaleString()});localStorage.setItem(key,JSON.stringify(a));e.target.reset();nameInput.value=u.name;comments()}
}
function admin(){
 const login=document.querySelector("#loginBox");if(!login)return;const dash=document.querySelector("#dashboard");
 function show(){const ok=sessionStorage.getItem("ja_admin")==="1";login.classList.toggle("hidden",ok);dash.classList.toggle("hidden",!ok);if(ok)renderAdmin()}
 document.querySelector("#loginBtn").onclick=()=>{if(document.querySelector("#email").value==="admin@jobsera.com"&&document.querySelector("#password").value==="Jobs Era123"){sessionStorage.setItem("ja_admin","1");show()}else alert("Incorrect admin credentials.")};
 document.querySelector("#logout").onclick=()=>{sessionStorage.removeItem("ja_admin");show()};
 document.querySelector("#contentForm").onsubmit=e=>{e.preventDefault();let p=getPosts();p.unshift({id:Date.now().toString(),type:document.querySelector("#type").value,title:document.querySelector("#title").value,meta:document.querySelector("#meta").value,location:document.querySelector("#location").value,link:document.querySelector("#link").value,description:document.querySelector("#description").value,date:new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})});savePosts(p);e.target.reset();renderAdmin();alert("Published successfully!")};show()
}
function renderAdmin(){let p=getPosts(),box=document.querySelector("#adminPosts");box.innerHTML=p.length?p.map(x=>`<div class="adminItem"><div><b>${esc(x.title)}</b><br><small class="tag">${x.type}</small></div><button class="delete" onclick="removePost('${x.id}')">Delete</button></div>`).join(""):"No posts";document.querySelector("#blogCount").textContent=p.filter(x=>x.type==="blog").length;document.querySelector("#jobCount").textContent=p.filter(x=>x.type==="job").length;let c=0;for(let x of p)c+=JSON.parse(localStorage.getItem("ja_comments_"+x.id)||"[]").length;document.querySelector("#commentCount").textContent=c}
window.removePost=id=>{if(confirm("Delete this post?")){savePosts(getPosts().filter(x=>x.id!==id));renderAdmin()}}
renderHome();renderPost();admin();
// User authentication (browser-local demo authentication).
function getUsers(){return JSON.parse(localStorage.getItem("ja_users")||"[]")}
function currentUser(){return JSON.parse(localStorage.getItem("ja_current_user")||"null")}
function setCurrentUser(u){localStorage.setItem("ja_current_user",JSON.stringify(u))}
function renderAuthNav(){
 const box=document.querySelector("#authNav");if(!box)return;const u=currentUser();
 if(!u){box.innerHTML='<a class="loginLink" href="login.html">Login</a>';return}
 const initial=(u.name||"U").trim().charAt(0).toUpperCase();
 box.innerHTML=`<div class="userMenu"><button class="userAvatar" aria-label="User menu">${esc(initial)}</button><div class="userDropdown"><strong>${esc(u.name)}</strong><small>${esc(u.email)}</small><button id="userLogout">Logout</button></div></div>`;
 const menu=box.querySelector(".userMenu");box.querySelector(".userAvatar").onclick=()=>menu.classList.toggle("open");
 box.querySelector("#userLogout").onclick=()=>{localStorage.removeItem("ja_current_user");location.href="index.html"}
}
function setupMobileAuthNav() {
    const mainNav = document.querySelector(".mainNav");
    const authNav = document.getElementById("authNav");
    const navActions = document.querySelector(".navActions");

    if (!mainNav || !authNav || !navActions) return;

    // Remember original desktop position
    const placeholder = document.createComment("authNav-position");
    navActions.insertBefore(placeholder, authNav);

    function updateAuthPosition() {
        if (window.innerWidth <= 1100) {

            // Put Login/User menu inside hamburger
            if (authNav.parentElement !== mainNav) {
                mainNav.appendChild(authNav);
            }

            authNav.classList.add("mobileAuthNav");

        } else {

            // Put it back in desktop navbar
            if (authNav.parentElement !== navActions) {
                placeholder.after(authNav);
            }

            authNav.classList.remove("mobileAuthNav");
        }
    }

    updateAuthPosition();

    window.addEventListener("resize", updateAuthPosition);
}

setupMobileAuthNav();
function authPage(){
 const lf=document.querySelector("#userLogin");if(!lf)return;const sf=document.querySelector("#userSignup"),msg=document.querySelector("#authMessage"),lt=document.querySelector("#loginTab"),st=document.querySelector("#signupTab");
 function tab(signup){lf.classList.toggle("hidden",signup);sf.classList.toggle("hidden",!signup);lt.classList.toggle("active",!signup);st.classList.toggle("active",signup);msg.textContent=""}
 lt.onclick=()=>tab(false);st.onclick=()=>tab(true);
 sf.onsubmit=e=>{e.preventDefault();let users=getUsers(),email=document.querySelector("#signupEmail").value.trim().toLowerCase();if(users.some(x=>x.email===email)){msg.textContent="An account with this email already exists.";return}let u={id:Date.now().toString(),name:document.querySelector("#signupName").value.trim(),email,password:document.querySelector("#signupPassword").value};users.push(u);localStorage.setItem("ja_users",JSON.stringify(users));setCurrentUser({id:u.id,name:u.name,email:u.email});location.href="index.html"};
 lf.onsubmit=e=>{e.preventDefault();let email=document.querySelector("#loginEmail").value.trim().toLowerCase(),password=document.querySelector("#loginPassword").value,u=getUsers().find(x=>x.email===email&&x.password===password);if(!u){msg.textContent="Incorrect email or password.";return}setCurrentUser({id:u.id,name:u.name,email:u.email});location.href="index.html"}
}
renderAuthNav();authPage();

function renderAllAdminComments(){const box=document.querySelector("#allComments");if(!box)return;let rows=[];getPosts().forEach(p=>JSON.parse(localStorage.getItem("ja_comments_"+p.id)||"[]").forEach((c,i)=>rows.push({...c,postId:p.id,postTitle:p.title,index:i})));box.innerHTML=rows.length?rows.map(c=>`<div class="adminComment"><div class="adminCommentTop"><div><b>${esc(c.name)}</b><div class="postRef">On: ${esc(c.postTitle)}</div></div><button class="commentDelete" onclick="deleteAdminComment('${c.postId}',${c.index})">Delete</button></div><p>${esc(c.text)}</p><small>${esc(c.date||"")}</small></div>`).join(""):'<div class="empty">No comments yet.</div>'}
window.deleteAdminComment=(id,i)=>{if(!confirm("Delete this comment?"))return;let k="ja_comments_"+id,a=JSON.parse(localStorage.getItem(k)||"[]");a.splice(i,1);localStorage.setItem(k,JSON.stringify(a));renderAllAdminComments();renderAdmin()}
function setupCommentsAdmin(){let o=document.querySelector("#openComments"),b=document.querySelector("#backDashboard"),d=document.querySelector("#dashboard"),p=document.querySelector("#commentsPage");if(!o)return;o.onclick=()=>{d.classList.add("hidden");p.classList.remove("hidden");renderAllAdminComments()};b.onclick=()=>{p.classList.add("hidden");d.classList.remove("hidden")}}setupCommentsAdmin();

function setupNavSearch(){
 const wrap=document.querySelector(".navSearch"),toggle=document.querySelector("#searchToggle"),input=document.querySelector("#navSearchInput"),results=document.querySelector("#navSearchResults");if(!wrap)return;
 const draw=()=>{let q=input.value.trim().toLowerCase();if(!q){results.innerHTML="";return}let a=getPosts().filter(p=>(p.status||"published")==="published").filter(p=>(p.title+" "+(p.meta||"")+" "+(p.location||"")+" "+p.description).toLowerCase().includes(q)).slice(0,8);results.innerHTML=a.length?a.map(p=>`<a class="searchResult" href="post.html?id=${encodeURIComponent(p.id)}"><b>${esc(p.title)}</b><small>${p.type==="job"?"Job":"Blog"} · ${esc(p.meta||"Jobs Era")}</small></a>`).join(""):'<div class="empty">No results found.</div>'};
 toggle.onclick=e=>{e.stopPropagation();wrap.classList.toggle("open");if(wrap.classList.contains("open"))setTimeout(()=>input.focus(),100)};
 input.oninput=draw;input.onkeydown=e=>{if(e.key==="Escape")wrap.classList.remove("open")};document.addEventListener("click",e=>{if(!wrap.contains(e.target))wrap.classList.remove("open")})
}
setupNavSearch();

function setupLanguage() {

    const btn = document.getElementById("languageSwitch");

    if (!btn) return;

    let currentLang =
        localStorage.getItem("ja_lang") || "en";


    function setLanguage(lang) {

        const select =
            document.querySelector(".goog-te-combo");

        if (!select) {

            setTimeout(() => {
                setLanguage(lang);
            }, 500);

            return;
        }


        select.value = lang;

        select.dispatchEvent(
            new Event("change")
        );


        currentLang = lang;

        localStorage.setItem(
            "ja_lang",
            lang
        );


        btn.textContent =
            lang === "en"
                ? "हिंदी"
                : "English";
    }


    btn.addEventListener(
        "click",
        function () {

            const newLanguage =
                currentLang === "en"
                    ? "hi"
                    : "en";

            setLanguage(newLanguage);

        }
    );


    // Restore selected language
    if (currentLang === "hi") {

        setTimeout(() => {
            setLanguage("hi");
        }, 1500);

    }

}

setupLanguage();

// ===== Jobs Era lightweight CMS =====
const defaultSiteSettings={
 heroPill:"Learn • Discover • Apply",heroTitle:"Stay informed.",heroAccent:"Find your next opportunity.",
 heroDescription:"Useful articles, career insights and verified job opportunities—all in one clean platform.",
 primaryButtonText:"Explore Jobs",secondaryButtonText:"Read Blogs",blogEyebrow:"INSIGHTS",blogHeading:"Latest Blogs",
 jobEyebrow:"OPPORTUNITIES",jobHeading:"Latest Jobs",footerText:"Career knowledge and opportunities that matter.",
 bgColor:"#ffffff",textColor:"#1d1d1f",primaryColor:"#0071e3",accentColor:"#e21b23",
 primaryButtonColor:"#0071e3",secondaryButtonColor:"#f5f5f7",loginButtonColor:"#0071e3",languageButtonColor:"#ffffff"
};
function getSiteSettings(){return {...defaultSiteSettings,...JSON.parse(localStorage.getItem("ja_site_settings")||"{}")}}
function saveSiteSettings(s){localStorage.setItem("ja_site_settings",JSON.stringify(s))}
function applySiteSettings(){
 const s=getSiteSettings(),r=document.documentElement;
 r.style.setProperty("--bg",s.bgColor);r.style.setProperty("--text",s.textColor);r.style.setProperty("--green",s.primaryColor);
 r.style.setProperty("--cms-accent",s.accentColor);r.style.setProperty("--cms-primary-btn",s.primaryButtonColor);
 r.style.setProperty("--cms-secondary-btn",s.secondaryButtonColor);r.style.setProperty("--cms-login-btn",s.loginButtonColor);
 r.style.setProperty("--cms-lang-btn",s.languageButtonColor);
 const map={cmsHeroPill:"heroPill",cmsHeroTitle:"heroTitle",cmsHeroAccent:"heroAccent",cmsHeroDescription:"heroDescription",
 cmsPrimaryButton:"primaryButtonText",cmsSecondaryButton:"secondaryButtonText",cmsBlogEyebrow:"blogEyebrow",
 cmsBlogHeading:"blogHeading",cmsJobEyebrow:"jobEyebrow",cmsJobHeading:"jobHeading",cmsFooterText:"footerText"};
 Object.entries(map).forEach(([id,k])=>{const e=document.getElementById(id);if(e)e.textContent=s[k]});
}
applySiteSettings();

let editingPostId=null;
function fillPostForm(p){
 editingPostId=p.id;
 ["type","title","slug","meta","author","status","featuredImage","tags","location","link","excerpt","description","seoTitle","seoDescription"].forEach(id=>{const e=document.getElementById(id);if(e)e.value=p[id]||""});
 const featured=document.getElementById("featured");if(featured)featured.checked=!!p.featured;
 const form=document.getElementById("contentForm");if(form){form.querySelector("h2").textContent="Edit post";form.querySelector('button[type="submit"]').textContent="Save Changes";form.scrollIntoView({behavior:"smooth",block:"start"})}
}
window.editPost=id=>{const p=getPosts().find(x=>x.id===id);if(p)fillPostForm(p)}
window.cancelPostEdit=()=>{editingPostId=null;const f=document.getElementById("contentForm");if(f){f.reset();f.querySelector("h2").textContent="Create a post";f.querySelector('button[type="submit"]').textContent="Publish Now"}}

function renderAdmin(){
 let p=getPosts(),box=document.querySelector("#adminPosts");if(!box)return;
 box.innerHTML=p.length?p.map(x=>`<div class="adminItem"><div><b>${esc(x.title)}</b><br><small class="tag">${x.type}</small><span class="statusPill ${x.status||"published"}">${x.status||"published"}</span>${x.featured?'<span class="featuredMark">★ Featured</span>':""}</div><div class="adminItemActions"><button class="editPost" onclick="editPost('${x.id}')">Edit</button><button class="delete" onclick="removePost('${x.id}')">Delete</button></div></div>`).join(""):"No posts";
 const bc=document.querySelector("#blogCount"),jc=document.querySelector("#jobCount"),cc=document.querySelector("#commentCount");
 if(bc)bc.textContent=p.filter(x=>x.type==="blog").length;if(jc)jc.textContent=p.filter(x=>x.type==="job").length;
 let c=0;for(let x of p)c+=JSON.parse(localStorage.getItem("ja_comments_"+x.id)||"[]").length;if(cc)cc.textContent=c;
}

function setupCmsAdmin(){
 const form=document.getElementById("contentForm");
 if(form)form.onsubmit=e=>{e.preventDefault();let posts=getPosts();
  const data={type:document.querySelector("#type").value,title:document.querySelector("#title").value,meta:document.querySelector("#meta").value,
  location:document.querySelector("#location").value,link:document.querySelector("#link").value,description:document.querySelector("#description").value};
  if(editingPostId){const i=posts.findIndex(x=>x.id===editingPostId);if(i>-1)posts[i]={...posts[i],...data};savePosts(posts);cancelPostEdit();alert("Post updated successfully!")}
  else{posts.unshift({id:Date.now().toString(),...data,date:new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})});savePosts(posts);form.reset();alert("Published successfully!")}
  renderAdmin();
 };
 const save=document.getElementById("saveSiteSettings");if(!save)return;
 const fields={editHeroPill:"heroPill",editHeroTitle:"heroTitle",editHeroAccent:"heroAccent",editHeroDescription:"heroDescription",
 editPrimaryButtonText:"primaryButtonText",editSecondaryButtonText:"secondaryButtonText",editBlogEyebrow:"blogEyebrow",
 editBlogHeading:"blogHeading",editJobEyebrow:"jobEyebrow",editJobHeading:"jobHeading",editFooterText:"footerText",
 editBgColor:"bgColor",editTextColor:"textColor",editPrimaryColor:"primaryColor",editAccentColor:"accentColor",
 editPrimaryButtonColor:"primaryButtonColor",editSecondaryButtonColor:"secondaryButtonColor",editLoginButtonColor:"loginButtonColor",
 editLanguageButtonColor:"languageButtonColor"};
 function load(){const s=getSiteSettings();Object.entries(fields).forEach(([id,k])=>{const e=document.getElementById(id);if(e)e.value=s[k]})}load();
 document.querySelectorAll(".editorTab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".editorTab").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll(".editorPane").forEach(p=>p.classList.toggle("hidden",p.dataset.editorPane!==b.dataset.editorTab))});
 save.onclick=()=>{const s=getSiteSettings();Object.entries(fields).forEach(([id,k])=>{const e=document.getElementById(id);if(e)s[k]=e.value});saveSiteSettings(s);applySiteSettings();alert("Website settings saved!")};
 document.getElementById("resetSiteSettings").onclick=()=>{if(confirm("Reset website content and colors to defaults?")){localStorage.removeItem("ja_site_settings");load();applySiteSettings();alert("Website settings reset.")}};
}
setupCmsAdmin();


// ===== Extended no-code CMS operations =====
const defaultOperations={
 defaultAuthor:"Jobs Era Team",postsPerPage:"12",defaultStatus:"published",allowComments:"yes",
 announcement:"",announcementLink:"",announcementEnabled:"no",siteTitle:"Jobs Era",
 siteDescription:"Career knowledge, useful articles and job opportunities.",contactEmail:"",
 copyright:"© 2026 Jobs Era",facebook:"",instagram:"",linkedin:"",youtube:"",
 headerMenu:"Home | index.html\nBlogs | #blogs\nJobs | #jobs",footerLinks:"",
 termsTitle:"Terms & Conditions",
 termsContent:`Welcome to Jobs Era. By accessing or using this website, you agree to these Terms & Conditions.

1. Website Purpose
Jobs Era provides job listings, career information, articles and related resources for informational purposes.

2. Accuracy of Information
We aim to keep information useful and current, but job details, deadlines, eligibility requirements and external information may change. Users should verify important details with the official employer, recruiter or relevant authority before applying or making decisions.

3. External Links
Jobs Era may link to third-party websites. We do not control those websites and are not responsible for their content, availability, security or privacy practices.

4. User Accounts and Comments
Users are responsible for information submitted through their accounts and comments. Content that is unlawful, abusive, misleading, spam, or infringes the rights of others may be removed.

5. Intellectual Property
Unless otherwise stated, the Jobs Era website design, branding and original content belong to Jobs Era and may not be copied or redistributed without permission.

6. No Employment Guarantee
Publishing or displaying a job opportunity does not guarantee employment, selection, interview, salary or any other outcome.

7. Changes to These Terms
These terms may be updated when necessary. Continued use of the website after an update means you accept the revised terms.

8. Contact
For questions about these terms, use the contact information provided on the website.`,
 privacyTitle:"Privacy Policy",
 privacyContent:`Jobs Era respects your privacy. This Privacy Policy explains the types of information the website may handle and how that information may be used.

1. Information You Provide
When you create an account, comment, contact us or use website features, you may provide information such as your name, email address and the content you submit.

2. Website and Browser Data
The website may use browser storage, including local storage, to remember settings such as login state, language preferences and website functionality.

3. How Information Is Used
Information may be used to provide website features, manage accounts and comments, remember preferences, improve the website and respond to requests.

4. Cookies and Third-Party Services
If Jobs Era uses analytics, advertising, translation, embedded content or other third-party services, those providers may use cookies or similar technologies according to their own policies.

5. External Websites
Job listings and articles may contain links to external websites. Their privacy practices are controlled by those websites, not Jobs Era.

6. Data Security
Reasonable measures should be used to protect website data, but no internet-based service can guarantee absolute security.

7. Your Choices
You may choose not to provide optional information. Where account or comment management features are available, you may contact the website administrator regarding your information.

8. Policy Updates
This policy may be updated as website features and data practices change.

9. Contact
For privacy questions, use the contact information provided on the website.`
};
function getOperations(){return {...defaultOperations,...JSON.parse(localStorage.getItem("ja_operations")||"{}")}}
function saveOperationsData(v){localStorage.setItem("ja_operations",JSON.stringify(v))}
function setupExtendedCms(){
 const root=document.querySelector(".cmsOperations");if(!root)return;
 const map={cmsDefaultAuthor:"defaultAuthor",cmsPostsPerPage:"postsPerPage",cmsDefaultStatus:"defaultStatus",cmsAllowComments:"allowComments",
 cmsAnnouncement:"announcement",cmsAnnouncementLink:"announcementLink",cmsAnnouncementEnabled:"announcementEnabled",cmsSiteTitle:"siteTitle",
 cmsSiteDescription:"siteDescription",cmsContactEmail:"contactEmail",cmsCopyright:"copyright",cmsFacebook:"facebook",cmsInstagram:"instagram",
 cmsLinkedin:"linkedin",cmsYoutube:"youtube",cmsHeaderMenu:"headerMenu",cmsFooterLinks:"footerLinks",
  cmsTermsTitle:"termsTitle",cmsTermsContent:"termsContent",cmsPrivacyTitle:"privacyTitle",cmsPrivacyContent:"privacyContent"};
 const load=()=>{const s=getOperations();Object.entries(map).forEach(([id,k])=>{const e=document.getElementById(id);if(e)e.value=s[k]||""});
  const a=document.getElementById("author"),st=document.getElementById("status");if(a&&!a.value)a.value=s.defaultAuthor;if(st)st.value=s.defaultStatus;renderAdminUsers()};
 load();
 document.querySelectorAll(".opsTab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".opsTab").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll(".opsPane").forEach(p=>p.classList.toggle("hidden",p.dataset.opsPane!==b.dataset.opsTab))});
 document.getElementById("saveOperations").onclick=()=>{const s=getOperations();Object.entries(map).forEach(([id,k])=>{const e=document.getElementById(id);if(e)s[k]=e.value});saveOperationsData(s);alert("Operations settings saved!")};
 document.getElementById("exportCmsData").onclick=()=>{const data={version:1,exportedAt:new Date().toISOString(),posts:getPosts(),users:getUsers(),siteSettings:getSiteSettings(),operations:getOperations()};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="jobs-era-backup-"+new Date().toISOString().slice(0,10)+".json";a.click();URL.revokeObjectURL(url)};
 document.getElementById("importCmsData").onchange=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(Array.isArray(d.posts))savePosts(d.posts);if(Array.isArray(d.users))localStorage.setItem("ja_users",JSON.stringify(d.users));if(d.siteSettings)saveSiteSettings(d.siteSettings);if(d.operations)saveOperationsData(d.operations);applySiteSettings();renderAdmin();load();alert("Website data imported successfully.")}catch(err){alert("Invalid backup file.")}};r.readAsText(file)};
 document.getElementById("clearDrafts").onclick=()=>{if(confirm("Delete every draft post?")){savePosts(getPosts().filter(p=>p.status!=="draft"));renderAdmin()}};
}
function renderAdminUsers(){const box=document.getElementById("adminUsers");if(!box)return;const users=getUsers();box.innerHTML=users.length?users.map(u=>`<div class="userAdminRow"><div><b>${esc(u.name||"User")}</b><small>${esc(u.email||"")}</small></div><button onclick="deleteCmsUser('${u.id}')">Delete</button></div>`).join(""):'<div class="empty">No registered users.</div>'}
window.deleteCmsUser=id=>{if(!confirm("Delete this user account?"))return;localStorage.setItem("ja_users",JSON.stringify(getUsers().filter(u=>u.id!==id)));renderAdminUsers()}
setupExtendedCms();


// ===== Editable legal pages =====
function renderPolicyPage(){
 const root=document.getElementById("policyPage");
 if(!root)return;
 const s=getOperations();
 const type=root.dataset.policy;
 const isTerms=type==="terms";
 const title=isTerms?s.termsTitle:s.privacyTitle;
 const content=isTerms?s.termsContent:s.privacyContent;
 document.title=(title||"Legal")+" — Jobs Era";
 const titleEl=document.getElementById("policyTitle");
 const contentEl=document.getElementById("policyContent");
 if(titleEl)titleEl.textContent=title||"";
 if(contentEl)contentEl.textContent=content||"";
}
renderPolicyPage();

(function setupLegalSave(){
 const btn=document.getElementById("saveLegalPages");
 if(!btn)return;
 btn.onclick=()=>{
   const s=getOperations();
   const fields={cmsTermsTitle:"termsTitle",cmsTermsContent:"termsContent",cmsPrivacyTitle:"privacyTitle",cmsPrivacyContent:"privacyContent"};
   Object.entries(fields).forEach(([id,k])=>{const e=document.getElementById(id);if(e)s[k]=e.value});
   saveOperationsData(s);
   alert("Legal pages saved successfully!");
 };
})();
