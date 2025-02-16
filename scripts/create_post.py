#!/usr/bin/env python3
import os
import datetime
from pathlib import Path

def create_post():
    print("=== 새 블로그 포스트 작성 ===")
    
    # 제목 입력
    title = input("포스트 제목을 입력하세요: ")
    
    # 카테고리 입력
    categories = input("카테고리를 입력하세요 (쉼표로 구분): ").split(',')
    categories = [cat.strip() for cat in categories]
    
    # 태그 입력
    tags = input("태그를 입력하세요 (쉼표로 구분): ").split(',')
    tags = [tag.strip() for tag in tags]
    
    # 현재 날짜로 파일명 생성
    today = datetime.datetime.now()
    filename = f"{today.strftime('%Y-%m-%d')}-{'-'.join(title.lower().split())}.md"
    
    # 포스트 경로
    posts_dir = Path(__file__).parent.parent / '_posts'
    posts_dir.mkdir(exist_ok=True)
    
    # 포스트 내용 생성
    content = f"""---
title: {title}
date: {today.strftime('%Y-%m-%d %H:%M:%S')} +0900
categories: [{', '.join(categories)}]
tags: [{', '.join(tags)}]
---

여기에 포스트 내용을 작성하세요.
"""
    
    # 파일 생성
    post_path = posts_dir / filename
    with open(post_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n✅ 포스트가 생성되었습니다: {filename}")
    print(f"📝 파일 위치: {post_path}")

if __name__ == '__main__':
    create_post()
