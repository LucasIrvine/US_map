var USmap = {
  
  width: 960,
  height: 500,
  
  init: function(){
    self = this;
    self.centered;
    self.projection();
  },
  
  projection: function(){
    self.projection = d3.geo.albersUsa()
      .scale(1000)
      .translate([self.width / 2, self.height / 2]);

    self.mainSvg();
  },
  
  mainSvg: function(){
    self.svg = d3.select('#mapWrap').append('svg')
      .attr('width', self.width)
      .attr('height', self.height);

    self.pather();
  },
  
  pather: function(){
    self.path = d3.geo.path()
      .projection(self.projection);

    self.grabJson();
  },
  
  grabJson: function(){
    d3.json('data/us.json', function (error, us) {
      //self.drawBackground(us);
      self.drawGroup(us);
     
    });
  },

  drawBackground: function(us){
    self.svg.append('rect')
      .attr('class', 'background')
      .attr('width', self.width)
      .attr('height', self.height)
      .on('click', self.stateClick);

    self.drawGroup(us);
  },

  drawGroup: function(us){
    self.g = self.svg.append('g');
    self.drawCounties(us);
    self.drawStates(us);
  },

  drawStates: function(us){
    self.g.append('g')
      .attr({'id' : 'states'})
      .selectAll('path.state')
      .data(topojson.feature(us, us.objects.states).features)
      .enter()
        .append('path')
        .attr('d', self.path)
        .attr({
          'class' : 'state',
          'opacity' : 0
        })
        .on('click', function(d,i){
          self.stateClick(d);
        });
  },

  stateClick: function(d){
    self.btnActive = 0;
    var x, y, k;

    if(d && self.centered !== d){
      var stateCntr = self.path.centroid(d);
      x = stateCntr[0];
      y = stateCntr[1];
      k = 5;
      self.centered = d;
      self.zoomOutBtn();

    } else {
      x = self.width / 2;
      y = self.height / 2;
      k = 1;
      self.centered = null;
      self.zoomBtnRemove();
    }
    
    self.g.selectAll('path')
    .classed('active', self.centered && function(d) { return d === self.centered; });

    self.g.transition()
      .duration(600)
      .attr("transform", "translate(" + self.width / 2 + "," + self.height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
  },

  drawCounties: function(us){
    self.g.append('g')
      .attr('id', 'counties')
      .selectAll('path.county')
      .data(topojson.feature(us, us.objects.counties).features)
       .enter()
        .append('path')
        .attr('class', 'county')
        .attr('d', self.path);
  },

  zoomOutBtn: function(){
    self.zoomBtnRemove();

    self.svg.append('rect')
      .attr({
        'opacity' : 0.4,
        'class' : 'zoomBtn',
        'width' : 100,
        'height' : 45,
        'x' : 50,
        'y' : 50,
        'fill' : '#ccc',
        'rx': 6,
        'ry': 6
      })
       .on('click', function(){
        self.zoomOut();
      });
   
    self.svg.append('svg:text')
      .text('Zoom Out')
      .attr({
        'opacity' : 0.8,
        'class' : 'zoomBtnText',
        'x' : 65,
        'y' : 78
      });
  },

  zoomBtnRemove: function(){
    d3.select('.zoomBtn')
      .remove();

     d3.select('.zoomBtnText')
      .remove();
  },

  zoomOut: function(){
    x = self.width / 2;
    y = self.height / 2;

    self.svg.selectAll('.active')
      .classed('active', false);

    self.g.transition()
      .duration(750)
      .attr("transform", "translate(" + x + "," + y + ")scale(1)translate(" + -x + "," + -y + ")");

    d3.select('.zoomBtn')
      .transition()
      .style('opacity', 0)
      .remove();

     d3.select('.zoomBtnText')
      .transition()
      .style('opacity', 0)
      .remove();
  }

};


USmap.init();