import json, sys, urllib.request, ssl
B = "https://bsv-niewerth.de/wp-json/wp/v2"
pages = json.load(open(sys.argv[1], encoding="utf-8"))
status = sys.argv[2]
def req(method, path, data=None):
    r = urllib.request.Request(B + path, method=method, data=json.dumps(data).encode() if data is not None else None, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(r, timeout=90) as f: return json.load(f)
existing = {}
for st in ("publish", "draft"):
    for p in req("GET", f"/pages?per_page=100&status={st}&context=edit&_fields=id,slug,parent"):
        existing[(p["slug"], p["parent"])] = p["id"]
ids = {}
order = sorted(pages, key=lambda k: pages[k]["url"].count("/"))
for k in order:
    v = pages[k]; parts = v["url"].strip("/").split("/")
    slug = parts[-1] if parts[0] else "start"
    parent = ids.get(parts[0] if parts[0] != "leistungen" or len(parts) > 1 else None, 0) if len(parts) > 1 else 0
    if len(parts) > 1: parent = ids[{"leistungen": "leistungen", "ratgeber": "ratgeber"}[parts[0]]]
    pid = existing.get((slug, parent))
    st = status if status != "auto" else (None if pid else "draft")
    body = {"title": v["title"], "slug": slug, "content": v["content"], "parent": parent, "comment_status": "closed", "ping_status": "closed"}
    if st: body["status"] = st
    res = req("POST", f"/pages/{pid}" if pid else "/pages", body)
    ids[k] = res["id"]
    raw = req("GET", f"/pages/{res['id']}?context=edit&_fields=content")["content"]["raw"]
    print(k, res["id"], res["status"], "OK" if raw.strip() == v["content"].strip() else "INHALT VERÄNDERT", res["link"])
json.dump(ids, open(sys.argv[3], "w"))
