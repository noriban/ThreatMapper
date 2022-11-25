package main

import (
	"context"
	"time"

	"github.com/jellydator/ttlcache/v3"
	"sigs.k8s.io/controller-runtime/pkg/log"
)

func NewCache(ctx context.Context, ttl time.Duration) *ttlcache.Cache[string, []CVE] {
	cacheLog := log.Log.WithName("cache")
	cache := ttlcache.New(
		ttlcache.WithTTL[string, []CVE](ttl),
		ttlcache.WithDisableTouchOnHit[string, []CVE](),
		ttlcache.WithCapacity[string, []CVE](250),
	)

	cache.OnInsertion(
		func(ctx context.Context, item *ttlcache.Item[string, []CVE]) {
			cacheLog.Info("key inserted", "image", item.Key(), "expires", item.ExpiresAt())
		},
	)

	cache.OnEviction(
		func(ctx context.Context, reason ttlcache.EvictionReason, item *ttlcache.Item[string, []CVE]) {
			cacheLog.Info("key evicted", "image", item.Key(), "reason", reason)
		},
	)

	go cache.Start()

	go func(ctx context.Context) {
		ticker := time.NewTicker(ttl * 2)
		defer ticker.Stop()

		select {
		case <-ctx.Done():
			cache.Stop()
			ticker.Stop()
			return
		case <-ticker.C:
			cache.DeleteExpired()
		}
	}(ctx)

	return cache
}
