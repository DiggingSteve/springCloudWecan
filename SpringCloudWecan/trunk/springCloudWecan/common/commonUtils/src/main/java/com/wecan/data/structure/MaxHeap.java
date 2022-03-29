/**
 * @description:
 * @author: yaodui
 * @time: 2021/9/6 15:26
 */
package com.wecan.data.structure;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

public class MaxHeap<T extends Comparable<T>> {

    public MaxHeap() {
        this.heap = new ArrayList<>();
    }

    public List<T> heap;

    private int getParentIndex(int i) throws Exception {
        if (i <= 0) throw new Exception("index must bigger than 0");
        int parentIndex = (int) Math.floor((i - 1) / 2); //除2向下取整
        return parentIndex;
    }

    private int getLeftChildIndex(int i) {
        return 2 * i + 1;
    }

    private int getRightChildIndex(int i) {
        return 2 * i + 2;
    }

    // 向上调整 大顶堆插入的时候需要向上调整
    private void shiftUp(int start) throws Exception {
        int currentIndex = start;
        if (start == 0) return;
        int parentIndex = getParentIndex(start);
        T current = heap.get(currentIndex);
        while (currentIndex > 0) {
            if (heap.get(parentIndex).compareTo(current) >= 0) {
                break;
            } else {
                heap.set(currentIndex, heap.get(parentIndex));
                heap.set(parentIndex, current);
                currentIndex = parentIndex;
                if (currentIndex == 0) break;
                parentIndex = getParentIndex(currentIndex);

            }
        }

    }

    //向下调整 大顶堆删除的时候 将最后一个元素替换到被删除节点 然后 向下调整数组
    private void shiftDown(int start) throws Exception {
        int length = heap.size();
        int currentIndex = start;
        int l = getLeftChildIndex(start);
        int r = getRightChildIndex(start);
        //左孩子不是最后一个时说明还存在右孩子
        while (true) {
            l = getLeftChildIndex(currentIndex);

            r = getRightChildIndex(currentIndex);
            if(l>length-1)break;
            //左孩子不是最后一个时说明还存在右孩子
            int maxIndex=0;
            T max = null;
            T left = heap.get(l);
            T current = heap.get(currentIndex);
            if (current.compareTo(left) < 0) {
                max = left;
                maxIndex=l;
            }
            if (r <= length - 1) {
                T right = heap.get(r);
                if (max == null && current.compareTo(right) < 0) {
                    max = right;
                    maxIndex=r;
                } else if (max!=null&&right.compareTo(max) > 0) {
                    max = right;
                    maxIndex=r;
                }
            }
            if (max == null) break;
            heap.set(maxIndex, current);
            heap.set(currentIndex, max);
            currentIndex =maxIndex;

        }


    }

    public void delete(int index) throws Exception {
        if (heap.isEmpty()) throw new Exception("数组已空");
        long length = heap.stream().count();
        if (index >= length) throw new Exception("索引超限");
        T data = heap.get((int) length - 1);
        heap.set(index, data);
        heap.remove((int) length - 1);
        shiftDown(index);
    }

    public void insert(T data) throws Exception {
        int size = heap.size();
        heap.add(data);
        //向上调整数组
        shiftUp(size);
    }
}
