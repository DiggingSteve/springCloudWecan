package com.wecan.data.structure;

import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class MaxHeapTest {

    @Test
    public void testMaxHeap() throws Exception{
        MaxHeap<Integer>maxHeap=new MaxHeap<>();
        maxHeap.insert(new Integer(58));
        maxHeap.insert(new Integer(10));
        maxHeap.insert(new Integer(44));
        maxHeap.insert(new Integer(1));
        maxHeap.insert(new Integer(5));
        maxHeap.insert(new Integer(3));
        maxHeap.insert(new Integer(2));
        maxHeap.insert(new Integer(1));
        maxHeap.insert(new Integer(58));
        maxHeap.insert(new Integer(10));
        maxHeap.insert(new Integer(44));
        maxHeap.insert(new Integer(1));
        maxHeap.insert(new Integer(5));
        maxHeap.insert(new Integer(3));
        maxHeap.insert(new Integer(2));
        maxHeap.insert(new Integer(1));
        maxHeap.insert(new Integer(58));
        maxHeap.insert(new Integer(10));
        maxHeap.insert(new Integer(44));
        maxHeap.insert(new Integer(1));
        maxHeap.insert(new Integer(5));
        maxHeap.insert(new Integer(3));
        maxHeap.insert(new Integer(2));
        maxHeap.insert(new Integer(1));


        System.out.println(maxHeap.heap);
        maxHeap.delete(0);

        System.out.println(maxHeap.heap);
        maxHeap.delete(0);
        System.out.println(maxHeap.heap);
        maxHeap.delete(0);
        System.out.println(maxHeap.heap);
        maxHeap.delete(0);
        System.out.println(maxHeap.heap);
        maxHeap.delete(0);
        System.out.println(maxHeap.heap);
        maxHeap.delete(0);
        System.out.println(maxHeap.heap);
        maxHeap.delete(0);
        System.out.println(maxHeap.heap);
        maxHeap.delete(0);
        System.out.println(maxHeap.heap);
        maxHeap.delete(0);
        System.out.println(maxHeap.heap);
        maxHeap.delete(0);
        System.out.println(maxHeap.heap);
        maxHeap.delete(0);
        System.out.println(maxHeap.heap);
        maxHeap.delete(0);
        System.out.println(maxHeap.heap);
        maxHeap.delete(0);
        System.out.println(maxHeap.heap);
        maxHeap.delete(0);
    }

    @Test
    public void testInt(){
        int a=250;
        int b=250;
        Integer c=new Integer(250);
        System.out.println(a==b);
        System.out.println(c==b);
    }
}