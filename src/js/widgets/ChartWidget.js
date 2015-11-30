var d3 = require('d3');
require('../util');

function ChartWidget(datastore) {
	var that = this;
	this.data = [];
	this.elem = document.createElement('div');

	this.value = null;

	this.datastore = datastore;
	var history = this.datastore.history();
	history.limit(20).on('data', function(data) {
		that.data = data;
		that.initialDraw(that.svg[0][0].parentNode.parentNode.clientWidth);
	});
	history.run();
	this.datastore.on('push', function(data) {
		that.data.push(data);
		that.data.shift();
		that.updateDraw();
	});
	this.initChart();

	window.addEventListener('resize', window.debounce(function(){
		that.updateDraw(that.svg[0][0].parentNode.parentNode.clientWidth);
	}, 200));
}

ChartWidget.prototype.settings = function() {
	return {
		'value' : {
			type : 'text',
			value : this.value
		}
	};
}

ChartWidget.prototype.onSettingsUpdated = function(result) {
	this.value = result.value;
	this.updateDraw();
}

ChartWidget.prototype.onSpanUpdated = function(start, end) {
	var that = this;
	var history = this.datastore.history();
	history.span(start.getTime(), end.getTime()).on('data', function(data) {
		that.data = data;
		that.updateDraw();
	});
	history.run();
}


ChartWidget.prototype.refersh = function() {
	this.initialDraw();
}

ChartWidget.prototype.getEl = function() {
	return this.elem;
}


// datastoreのデータを、描画用のデータに変換する
ChartWidget.prototype.get_graph_data = function(data){
	var that = this;
	if(data[0] && this.value==null) {
		var filterd = Object.keys(data[0].value).filter(function(k) {return ((typeof data[0].value[k]) == 'number');});
		var key = filterd[0];
		this.value = key;
	}
	return data.map(function(d) {
		return {
			date : new Date(d.timestamp),
			value : d.value[that.value]
		};
	});
}

// 描画するデータをセット／更新
ChartWidget.prototype.setDatas = function(data) {
	this.data = data;
}

// 初期化
ChartWidget.prototype.initChart = function() {

	// 描画範囲に関する変数
	var margin = {top: 50, right: 20, bottom: 50, left: 50},
	    width = 480 - margin.left - margin.right,
	    height = 420 - margin.top - margin.bottom;

	// x軸のスケール（時間）。レンジ(出力範囲)の指定
	var xScale = d3.time.scale()
	              .range([0, width]);

	// y軸のスケール（センサーデータの値）。レンジ(出力範囲)の指定
	var yScale = d3.scale.linear()
	              .range([height, 0]);

	// スケールを元にx軸の設定（入力値の範囲はまだ指定していない。データを受け取ってから指定する）
	var xAxis = d3.svg.axis()
	            .scale(xScale)
	            .orient("bottom");

	// スケールを元にy軸の設定
	var yAxis = d3.svg.axis()
	            .scale(yScale)
	            .orient("left");

	// SVG要素の作成（attrとかはテンプレ）
	var svg = d3.select(this.elem).append("svg")
	          .attr("class", "chart")
	          .attr("width", width + margin.left + margin.right)
	          .attr("height", height + margin.top + margin.bottom)
	        .append("g")
	          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// 折れ線グラフの設定。xに時間、yにセンサーデータの値を設定。
	var line = d3.svg.line()
              .x(function(d) {
                return xScale(d.date);
              })
              .y(function(d) {
                return yScale(d.value);
              });

    var area = d3.svg.area()
              .x(function(d) {
                // xスケールでマップされた時間を返す
                return xScale(d.date);
              })
              .y0(height+30)
              .y1(function(d) {
                // yスケールでマップされたセンサーデータの値を返す
                return yScale(d.value);
              });


	// もろもろをメンバ変数に
	this.height = height;
	this.margin = margin;
	this.width = width;
	this.xScale = xScale;
	this.yScale = yScale;
	this.xAxis = xAxis;
	this.yAxis = yAxis;
	this.svg = svg;
	this.line = line;
	this.area = area;
}


// 最初の描画
ChartWidget.prototype.initialDraw = function(width) {

	var that = this;

	width = width || this.width;
  this.width = width;

  var viewWidth = this.width - this.margin.left - this.margin.right;

	var dataset = this.get_graph_data(this.data);

	this.xScale.range([0, viewWidth]);
  this.yScale.range([this.height, 0]);


	// ドメイン（入力値の範囲）の設定、extentメソッドでdatasetの最小と最大を返す
	this.xScale.domain(d3.extent(dataset, function(d) { return d.date; }));
	this.yScale.domain(d3.extent(dataset, function(d) { return d.value; }));

		// 折れ線の描画
	this.svg.append("path")
            .datum(dataset)
            .attr("class", "area")
            .attr("d", this.area);

  this.svg.append("path")
            .datum(dataset)
            .attr("class", "line")
            .attr("d", this.line);


    var point = this.svg
                .append("g")
                .attr("class", "line-point");

    point.selectAll('circle')
        .data(dataset)
        .enter().append('circle')
        .attr("cx", function(d, i) {
            return that.xScale(d.date);
        })
        .attr("cy", function(d, i) { return that.yScale(d.value) })
        .attr("r", 5)
        .style("fill", '#F09819');


	 // x軸の描画
    var xAxisEl = this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (this.height+25) + ")");

    xAxisEl.append("rect")
            .attr("class", "axisback")
            .attr("width", this.width + 120)
            .attr("transform", "translate(-60,-6)")
            .attr("height", 50);

    xAxisEl.append("line")
            .attr("class", "axisline")
            .attr("x1", 0)
            .attr("x2", this.width - this.margin.left - this.margin.right + 12)
            .attr("transform", "translate(-6,-6)");

    xAxisEl.call(this.xAxis);


    // y軸の描画
    this.svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(-10,0)")
            .call(this.yAxis);
}


// 更新した際の描画
ChartWidget.prototype.updateDraw = function(width) {

	var that = this;

	width = width || this.width;
  this.width = width;

  var viewWidth = this.width - this.margin.left - this.margin.right;

	var dataset = this.get_graph_data(this.data);

	this.xScale.range([0, viewWidth]);
  this.yScale.range([this.height, 0]);

	// ドメイン（入力値の範囲）の更新
	this.xScale.domain(d3.extent(dataset, function(d) { return d.date; }));
	this.yScale.domain(d3.extent(dataset, function(d) { return d.value; }));

	// アニメーションしますよ、という宣言
	var svg = this.svg.transition();

  svg.select(".area")   // 折れ線を
        .duration(750) // 750msで
        .attr("d", this.area(dataset)); // （新しい）datasetに変化させる描画をアニメーション

  svg.select(".line")   // 折れ線を
        .duration(750) // 750msで
        .attr("d", this.line(dataset)); // （新しい）datasetに変化させる描画をアニメーション

  svg.selectAll("circle")
        .attr("cx", function(d, i) {
            return that.xScale(d.date);
        })   // 折れ線を
        .duration(750);

  svg.select(".x.axis") // x軸を
        .duration(750) // 750msで
        .call(this.xAxis); // （domainの変更によって変化した）xAxisに変化させる描画をアニメーション

  svg.select(".axisline")
        .duration(750) // 750msで
        .attr("x2", this.width - this.margin.left - this.margin.right + 12);

  svg.select(".axisback")
        .duration(750) // 750msで
        .attr("width", this.width + 120);

  svg.select(".y.axis") // y軸を
        .duration(750) // 750msで
        .call(this.yAxis); // （domainの変更によって変化した）yAxisに変化させる描画をアニメーション
}

module.exports = ChartWidget;
