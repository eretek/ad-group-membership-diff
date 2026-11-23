/*! Eretek Online Araçlar #32 — AD Grup Üyeliği Karşılaştırıcı */
ERT.def('32', {
	run: function (v, c) {
		var load = function (t, f) {
			var r = c.csv(t, f, 50000), H = r.head, iS = ERT.csv.col(H, ['sid', 'objectsid']), iG = ERT.csv.col(H, ['objectguid', 'guid']), iN = ERT.csv.col(H, ['samaccountname', 'sam']), iD = ERT.csv.col(H, ['name', 'displayname', 'distinguishedname']);
			if (iS < 0 && iG < 0 && iN < 0) { throw c.fe(f, 'col', { c: 'SID / objectGUID / SamAccountName' }); }
			var key = iS >= 0 ? 'SID' : (iG >= 0 ? 'objectGUID' : 'SamAccountName'), m = new Map();
			r.rows.forEach(function (x) { var k = (x[iS >= 0 ? iS : (iG >= 0 ? iG : iN)] || '').trim().toLowerCase(); if (k) { m.set(k, { k: k, name: (iD >= 0 ? x[iD] : '') || (iN >= 0 ? x[iN] : k), sam: iN >= 0 ? x[iN] : '' }); } });
			return { key: key, m: m };
		};
		var A = load(v.a, 'a'), B = load(v.b, 'b');
		if (A.key !== B.key) { throw c.fe('b', 'keyMis', { a: A.key, b: B.key }); }
		var rows = [], cls = [], cnt = { add: 0, del: 0, ren: 0, same: 0 };
		A.m.forEach(function (x, k) { var y = B.m.get(k); if (!y) { cnt.del++; rows.push([c.t('del'), x.name, x.k, '']); cls.push('err'); } else if (x.name !== y.name || x.sam !== y.sam) { cnt.ren++; rows.push([c.t('ren'), x.name + ' → ' + y.name, x.k, '']); cls.push('warn'); } else { cnt.same++; } });
		B.m.forEach(function (y, k) { if (!A.m.has(k)) { cnt.add++; rows.push([c.t('add'), y.name, y.k, '']); cls.push('ok'); } });
		var cols = [c.t('c_st'), c.t('c_name'), A.key, ''];
		return { big: c.t('sum', cnt), msgs: [['info', c.t('keyUsed', { k: A.key })]], tables: rows.length ? [{ cols: cols.slice(0, 3), rows: rows.map(function (r) { return r.slice(0, 3); }), cls: cls }] : [], x: rows.length ? { csv: { name: 'group-diff', cols: cols.slice(0, 3), rows: rows.map(function (r) { return r.slice(0, 3); }) } } : {}, v: cnt };
	}
});
