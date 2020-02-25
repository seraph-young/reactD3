import React, { Component } from 'react';
import {nodeData, relData} from 'data/Data'
import './Chart.less';
import * as d3 from 'd3'

const WIDTH = 1900;
const HEIGHT = 580;
const R = 30;

class MyChar extends Component {

    componentDidMount() {
        // 设定点
        let nodes = [];
        for (let i = 0; i < nodeData.length; i++) {
            nodes.push({
                id: (nodeData[i] && nodeData[i].id) || '', // 节点id
                name: (nodeData[i] && nodeData[i].name) || '', // 节点名称
            });
        }
        //设定点与点之间的连线关系
        let edges = [];
        for (let i = 0; i < relData.length; i++) {
            edges.push({
                id: (relData[i] && (relData[i].id)) || '', // 连线id
                source: relData[i].source, // 开始节点
                target: relData[i].target, // 结束节点
                tag: (relData[i].tag) || '', // 连线名称
            });
        }
        // 定义d3的力导向模型
        const simulation = d3.forceSimulation(nodes) // 指定被引用的nodes数组
            .force('link', d3.forceLink(edges).id(d => d.id).distance(150))
            .force('collision', d3.forceCollide(1).strength(0.1))
            .force('center', d3.forceCenter(WIDTH / 2, HEIGHT / 2))
            .force('charge', d3.forceManyBody().strength(-1000).distanceMax(800));
        // 根据模型，通过id找到节点元素，绘制图形
        // 绘制图形第一步: 绘制点
        const svg = d3.select('#theChart').append('svg') // 在id为‘theChart’的标签内创建svg
            .style('width', WIDTH)
            .style('height', HEIGHT * 0.9)
            .on('click', () => {
                console.log('click', d3.event.target.tagName);
            });
        const g = svg.append('g'); // 则svg中创建g
        // 绘制图形第二步: 绘制连线
        const edgesLine = svg.select('g')
            .selectAll('line')
            .data(edges) // 绑定数据
            .enter() // 为数据添加对应数量的占位符
            .append('path') // 在占位符上面生成折线（用path画）
            .attr('d', (d) => { return d && 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y; }) //遍历所有数据。d表示当前遍历到的数据，返回绘制的贝塞尔曲线
            .attr('id', (d, i) => { return i && 'edgepath' + i; }) // 设置id，用于连线文字
            .attr('marker-end', 'url(#arrow)') // 根据箭头标记的id号标记箭头
            .style('stroke', '#000') // 颜色
            .style('stroke-width', 1); // 粗细
        // 绘制图形第三步: 给连线命名
        const edgesText = svg.select('g').selectAll('.edgelabel')
            .data(edges)
            .enter()
            .append('text') // 为每一条连线创建文字区域
            .attr('class', 'edgelabel')
            .attr('dx', 80)
            .attr('dy', 0);
        edgesText.append('textPath')
            .attr('xlink:href', (d, i) => { return i && '#edgepath' + i; }) // 文字布置在对应id的连线上
            .style('pointer-events', 'none') // 禁止鼠标事件
            .text((d) => { return d && d.tag; }); // 设置文字内容

    }

    render() {
        return (
            <div className="outerDiv">
                <div className="theChart" id="theChart" ref="theChart">

                </div>
            </div>
        );
    }
}

export default MyChar;



